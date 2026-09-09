import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { app, db } from './firebase';
import { UserProfile, UserRole, Creator } from '../types';
import { dbService } from './dbService';

export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const authService = {
  async signInWithGoogle(): Promise<User | null> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err: any) {
      console.warn('signInWithPopup failed or was blocked by COOP/popup policy. Falling back to signInWithRedirect:', err);
      try {
        await signInWithRedirect(auth, googleProvider);
        return null;
      } catch (redirectErr) {
        console.error('signInWithRedirect failed:', redirectErr);
        throw redirectErr;
      }
    }
  },

  async handleRedirectResult(creatorsList?: Creator[]): Promise<UserProfile | null> {
    try {
      const result = await getRedirectResult(auth);
      if (result && result.user) {
        return await this.resolveUserProfile(result.user, creatorsList);
      }
    } catch (err) {
      console.error('Error handling Google redirect result:', err);
    }
    return null;
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Resolves or initializes user profile in Firestore `users` collection.
   * Direct Firestore query matches creators by email!
   */
  async resolveUserProfile(user: User, creatorsList?: Creator[]): Promise<UserProfile> {
    const userDocRef = doc(db, 'users', user.uid);
    let userSnap;
    try {
      userSnap = await getDoc(userDocRef);
    } catch (err) {
      console.warn('Firestore read error under users/' + user.uid + ' (Check Firestore Rules in Firebase Console):', err);
    }

    const email = (user.email || '').toLowerCase().trim();
    const googlePhoto = user.photoURL || undefined;

    let matchedCreator: Creator | undefined = undefined;

    // 1. Query Firestore creators collection directly by email
    if (email) {
      try {
        const creatorsRef = collection(db, 'creators');
        const q = query(creatorsRef, where('email', '==', email));
        const creatorSnaps = await getDocs(q);
        if (!creatorSnaps.empty) {
          const docSnap = creatorSnaps.docs[0];
          matchedCreator = {
            id: docSnap.id,
            ...docSnap.data()
          } as Creator;
        }
      } catch (err) {
        console.warn('Firestore query error on creators collection (Check Firestore Rules in Firebase Console):', err);
      }

      // Fallback check against in-memory creatorsList if passed
      if (!matchedCreator && creatorsList && creatorsList.length > 0) {
        matchedCreator = creatorsList.find(
          (c) => (c.email || '').toLowerCase().trim() === email
        );
      }
    }

    // 2. Check existing user document in Firestore
    if (userSnap && userSnap.exists()) {
      const existingData = userSnap.data() as UserProfile;

      // If user had role 'unassigned' but now email matches a Creator (onboarded by admin!)
      if (existingData.role === 'unassigned' && matchedCreator) {
        const updatedProfile: UserProfile = {
          ...existingData,
          role: 'creator',
          creatorId: matchedCreator.id,
          photoURL: googlePhoto || matchedCreator.profileImage || existingData.photoURL
        };
        try {
          await setDoc(userDocRef, updatedProfile, { merge: true });
        } catch (e) {
          console.warn('Failed to merge updated user profile:', e);
        }

        // Sync Google photoURL to Creator profile if missing
        if (googlePhoto && (!matchedCreator.profileImage || matchedCreator.profileImage.includes('unsplash'))) {
          try {
            await dbService.updateCreator(matchedCreator.id, { profileImage: googlePhoto });
          } catch (e) {
            console.warn('Failed to update creator profile image:', e);
          }
        }
        return updatedProfile;
      }

      // If user is already assigned a valid role ('super', 'admin', 'creator')
      if (existingData.role !== 'unassigned') {
        if (googlePhoto && existingData.photoURL !== googlePhoto) {
          try {
            await setDoc(userDocRef, { photoURL: googlePhoto }, { merge: true });
          } catch (e) {
            console.warn('Failed to sync photoURL:', e);
          }
          existingData.photoURL = googlePhoto;
        }
        return existingData;
      }
    }

    // 3. User document does not exist or remains unassigned
    let role: UserRole = 'unassigned';
    let creatorId: string | undefined = undefined;

    if (matchedCreator) {
      role = 'creator';
      creatorId = matchedCreator.id;

      if (googlePhoto && (!matchedCreator.profileImage || matchedCreator.profileImage.includes('unsplash'))) {
        try {
          await dbService.updateCreator(matchedCreator.id, { profileImage: googlePhoto });
        } catch (e) {
          console.warn('Failed to update creator profile image:', e);
        }
      }
    }

    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || matchedCreator?.name || user.email?.split('@')[0] || 'User',
      photoURL: googlePhoto || matchedCreator?.profileImage,
      role,
      creatorId,
      createdAt: new Date().toISOString()
    };

    // Save default document in Firestore `users/{uid}`
    try {
      await setDoc(userDocRef, newProfile);
      console.log('Saved new user profile document in Firestore: users/' + user.uid, newProfile);
    } catch (err) {
      console.error('Failed to save user document to Firestore (Check Firestore Security Rules in Firebase Console):', err);
    }

    return newProfile;
  },

  /**
   * Promotes an authenticated user to Super Admin role in Firestore.
   */
  async setSuperAdmin(uid: string, userDetails?: Partial<UserProfile>): Promise<UserProfile> {
    const userDocRef = doc(db, 'users', uid);
    const updates: Partial<UserProfile> = {
      role: 'super',
      ...userDetails,
      updatedAt: new Date().toISOString()
    };
    await setDoc(userDocRef, updates, { merge: true });
    const userSnap = await getDoc(userDocRef);
    return userSnap.data() as UserProfile;
  }
};


