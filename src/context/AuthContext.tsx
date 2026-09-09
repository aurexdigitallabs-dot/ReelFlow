import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { UserProfile, UserRole, ContentItem, Creator } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  userRole: UserRole;
  isLoggedIn: boolean;
  isAuthorized: boolean;
  signInWithGoogle: () => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  promoteToSuperAdmin: () => Promise<void>;
  
  // Permission checks
  canAddStore: boolean;
  canManageCreators: boolean;
  canEditContent: (item: ContentItem) => boolean;
  userCreatorId: string | null;
  assignedStoreIds: string[] | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode; creators: Creator[] }> = ({
  children,
  creators
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [_isLoadingAuth, setIsLoadingAuth] = useState(false);

  useEffect(() => {
    // Process redirect result if coming back from signInWithRedirect
    authService.handleRedirectResult(creators).then((redirectProfile) => {
      if (redirectProfile) {
        setUserProfile(redirectProfile);
      }
    });

    const unsub = authService.onAuthStateChanged(async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        setIsLoadingAuth(true);
        try {
          const profile = await authService.resolveUserProfile(firebaseUser, creators);
          setUserProfile(profile);
        } catch (err) {
          console.error('Error resolving user profile from Firestore:', err);
          // Fallback profile if Firestore read/write fails so user is recognized as logged in (unassigned)
          const fallbackProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            photoURL: firebaseUser.photoURL || undefined,
            role: 'unassigned',
            createdAt: new Date().toISOString()
          };
          setUserProfile(fallbackProfile);
        } finally {
          setIsLoadingAuth(false);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsub();
  }, [creators]);

  const signInWithGoogle = async (): Promise<UserProfile | null> => {
    setIsLoadingAuth(true);
    try {
      const user = await authService.signInWithGoogle();
      if (user) {
        const profile = await authService.resolveUserProfile(user, creators);
        setUserProfile(profile);
        return profile;
      }
      return null;
    } catch (err) {
      console.error('Google Sign in failed:', err);
      return null;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const promoteToSuperAdmin = async () => {
    if (!currentUser) return;
    try {
      const updatedProfile = await authService.setSuperAdmin(currentUser.uid, {
        email: currentUser.email || '',
        displayName: currentUser.displayName || 'Super Admin',
        photoURL: currentUser.photoURL || undefined
      });
      setUserProfile(updatedProfile);
    } catch (err) {
      console.error('Failed to promote user to super admin:', err);
      // Fallback update in state if Firestore write failed
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          role: 'super'
        });
      }
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setUserProfile(null);
  };

  const rawRole: string = userProfile?.role || 'unassigned';
  const isSuper = rawRole === 'super_admin' || rawRole === 'super';
  const userRole: UserRole = isSuper ? 'super_admin' : (rawRole as UserRole);

  const isLoggedIn = !!currentUser && !!userProfile;
  const isAuthorized = isLoggedIn && userRole !== 'unassigned';
  const userCreatorId = userProfile?.creatorId || null;
  const assignedStoreIds = userProfile?.assignedStoreIds || null;

  // Permission Checks
  const canAddStore = isSuper;
  const canManageCreators = isSuper || userRole === 'admin';

  const canEditContent = (item: ContentItem): boolean => {
    if (isSuper) return true;
    if (userRole === 'admin') {
      if (!assignedStoreIds || assignedStoreIds.length === 0) return true;
      return assignedStoreIds.includes(item.storeId);
    }
    if (userRole === 'creator') {
      if (!userCreatorId) return false;
      return item.creatorIds.includes(userCreatorId);
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        userRole,
        isLoggedIn,
        isAuthorized,
        signInWithGoogle,
        logout,
        promoteToSuperAdmin,
        canAddStore,
        canManageCreators,
        canEditContent,
        userCreatorId,
        assignedStoreIds
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

