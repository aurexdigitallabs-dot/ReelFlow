import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Store, Creator, Category, ContentItem, AppNotification, FilterState, ActiveTab, ViewMode, ShootStatus, PostStatus } from '../types';
import { dbService } from '../services/dbService';
import { storageService } from '../services/storageService';
import { emailService } from '../services/emailService';
import { INITIAL_CATEGORIES } from '../data/seedData';

interface AppContextType {
  stores: Store[];
  creators: Creator[];
  categories: Category[];
  content: ContentItem[];
  notifications: AppNotification[];
  currentStoreId: string;
  setCurrentStoreId: (id: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  enterApp: (targetTab?: ActiveTab) => void;
  goToLanding: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isLoading: boolean;
  
  // Filters & Search
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  
  // Modals state & prefill
  isAddContentOpen: boolean;
  setIsAddContentOpen: (open: boolean) => void;
  addContentPrefill: Partial<ContentItem> | null;
  openAddContent: (prefill?: Partial<ContentItem>) => void;
  
  editingContent: ContentItem | null;
  setEditingContent: (item: ContentItem | null) => void;
  isEditContentOpen: boolean;
  setIsEditContentOpen: (open: boolean) => void;
  openEditContent: (item: ContentItem) => void;
  closeEditContent: () => void;
  duplicateContent: (item: ContentItem) => Promise<void>;
  
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (open: boolean) => void;
  
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  
  selectedCreatorId: string | null;
  setSelectedCreatorId: (id: string | null) => void;
  
  selectedContentId: string | null;
  setSelectedContentId: (id: string | null) => void;
  
  // Real DB Actions
  addContent: (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateContent: (id: string, item: Partial<ContentItem>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  updateShootStatus: (id: string, status: ShootStatus) => Promise<void>;
  updatePostStatus: (id: string, status: PostStatus) => Promise<void>;
  
  addCreator: (creator: Omit<Creator, 'id' | 'createdAt'>) => Promise<void>;
  updateCreator: (id: string, creator: Partial<Creator>) => Promise<void>;
  deleteCreator: (id: string) => Promise<void>;
  
  addStore: (store: Omit<Store, 'id' | 'createdAt'>) => Promise<void>;
  updateStore: (id: string, store: Partial<Store>) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  seedSampleDatabase: () => Promise<void>;
  
  // Computed data
  filteredContent: ContentItem[];
  currentStore: Store | null;
}

const DEFAULT_FILTERS: FilterState = {
  storeId: 'all',
  creatorId: 'all',
  categoryId: 'all',
  shootStatus: 'all',
  postStatus: 'all',
  priority: 'all',
  searchQuery: '',
  datePreset: 'all'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [currentStoreId, setCurrentStoreIdState] = useState<string>(() => {
    return localStorage.getItem('reelflow_current_store_id') || 'all';
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('reelflow_view_mode');
    return (saved === 'app' || saved === 'landing') ? saved : 'landing';
  });

  const [activeTab, setActiveTabState] = useState<ActiveTab>(() => {
    const saved = localStorage.getItem('reelflow_active_tab');
    return (saved as ActiveTab) || 'dashboard';
  });

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem('reelflow_view_mode', mode);
  };

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    localStorage.setItem('reelflow_active_tab', tab);
  };

  // Initialize theme from localStorage if available
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [addContentPrefill, setAddContentPrefill] = useState<Partial<ContentItem> | null>(null);
  
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [isEditContentOpen, setIsEditContentOpen] = useState(false);
  
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('reelflow_read_notifs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);

  const openEditContent = (item: ContentItem) => {
    setEditingContent(item);
    setIsEditContentOpen(true);
  };

  const closeEditContent = () => {
    setEditingContent(null);
    setIsEditContentOpen(false);
  };

  const duplicateContent = async (item: ContentItem) => {
    const { id, createdAt, updatedAt, ...rest } = item;
    await dbService.addContent({
      ...rest,
      title: `${item.title} (Copy)`
    });
  };

  const enterApp = (targetTab?: ActiveTab) => {
    if (targetTab) {
      setActiveTab(targetTab);
    }
    setViewMode('app');
  };

  const goToLanding = () => {
    setViewMode('landing');
  };


  // Firestore Realtime Subscriptions
  useEffect(() => {
    // Apply initial theme attribute on mount
    document.documentElement.setAttribute('data-theme', theme);
    setIsLoading(true);
    const unsubStores = dbService.subscribeStores((data) => setStores(data));
    const unsubCreators = dbService.subscribeCreators((data) => setCreators(data));
    const unsubCategories = dbService.subscribeCategories((data) => {
      if (!data || data.length === 0) {
        setCategories(INITIAL_CATEGORIES);
      } else {
        setCategories(data);
      }
    });
    const unsubContent = dbService.subscribeContent((data) => {
      setContent(data);
      setIsLoading(false);
    });

    return () => {
      unsubStores();
      unsubCreators();
      unsubCategories();
      unsubContent();
    };
  }, []);

  // We'll define notifications below after filteredContent is derived

  const setCurrentStoreId = (id: string) => {
    setCurrentStoreIdState(id);
    localStorage.setItem('reelflow_current_store_id', id);
    setFilters(prev => ({ ...prev, storeId: id }));
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('reelflow_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const openAddContent = (prefill?: Partial<ContentItem>) => {
    setAddContentPrefill(prefill || null);
    setIsAddContentOpen(true);
  };

  const resetFilters = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      storeId: currentStoreId
    });
  };

  // Real DB Content Actions
  const addContent = async (itemData: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    await dbService.addContent(itemData);
    
    // Trigger task assigned emails
    if (itemData.creatorIds && itemData.creatorIds.length > 0) {
      itemData.creatorIds.forEach(creatorId => {
        const creator = creators.find(c => c.id === creatorId);
        if (creator && creator.email) {
          emailService.sendTaskAssignedEmail(creator.email, creator.name, itemData.title, itemData.shootDate);
        }
      });
    }
  };

  const updateContent = async (id: string, updates: Partial<ContentItem>) => {
    await dbService.updateContent(id, updates);
  };

  const deleteContent = async (id: string) => {
    await dbService.deleteContent(id);
  };

  const updateShootStatus = async (id: string, shootStatus: ShootStatus) => {
    if (shootStatus === 'Cancelled') {
      await dbService.updateContent(id, { shootStatus, postStatus: 'Cancelled' });
    } else {
      await dbService.updateShootStatus(id, shootStatus);
    }
    
    const item = content.find((i) => i.id === id);
    if (item && item.creatorIds) {
      item.creatorIds.forEach(creatorId => {
        const creator = creators.find(c => c.id === creatorId);
        if (creator && creator.email) {
          emailService.sendStatusUpdatedEmail(creator.email, creator.name, item.title, shootStatus);
        }
      });
    }
  };

  const updatePostStatus = async (id: string, postStatus: PostStatus) => {
    const item = content.find((i) => i.id === id);
    if (
      item &&
      (postStatus === 'Editing' || postStatus === 'Ready' || postStatus === 'Posted') &&
      item.shootStatus !== 'Shot'
    ) {
      await dbService.updateContent(id, { postStatus, shootStatus: 'Shot' });
    } else {
      await dbService.updatePostStatus(id, postStatus);
    }
    
    if (item && item.creatorIds) {
      item.creatorIds.forEach(creatorId => {
        const creator = creators.find(c => c.id === creatorId);
        if (creator && creator.email) {
          emailService.sendStatusUpdatedEmail(creator.email, creator.name, item.title, postStatus);
        }
      });
    }
  };

  // Real DB Creator Actions
  const addCreator = async (creatorData: Omit<Creator, 'id' | 'createdAt'>) => {
    await dbService.addCreator(creatorData);
    if (creatorData.email) {
      emailService.sendWelcomeEmail(creatorData.email, creatorData.name);
    }
  };

  const updateCreator = async (id: string, updates: Partial<Creator>) => {
    await dbService.updateCreator(id, updates);
  };

  const deleteCreator = async (id: string) => {
    await dbService.deleteCreator(id);
  };

  // Real DB Store Actions
  const addStore = async (storeData: Omit<Store, 'id' | 'createdAt'>) => {
    await dbService.addStore(storeData);
  };

  const updateStore = async (id: string, updates: Partial<Store>) => {
    await dbService.updateStore(id, updates);
  };

  // Real DB Category Actions
  const addCategory = async (catData: Omit<Category, 'id'>) => {
    await dbService.addCategory(catData);
  };

  const seedSampleDatabase = async () => {
    await dbService.seedInitialDefaults();
  };

  // Filtered Content derivation
  const filteredContent = useMemo(() => {
    return content.filter(item => {
      if (currentStoreId !== 'all' && item.storeId !== currentStoreId) {
        return false;
      }
      if (filters.storeId !== 'all' && item.storeId !== filters.storeId) {
        return false;
      }
      if (filters.creatorId !== 'all' && !item.creatorIds.includes(filters.creatorId)) {
        return false;
      }
      if (filters.categoryId !== 'all' && item.categoryId !== filters.categoryId) {
        return false;
      }
      if (filters.shootStatus !== 'all' && item.shootStatus !== filters.shootStatus) {
        return false;
      }
      if (filters.postStatus !== 'all' && item.postStatus !== filters.postStatus) {
        return false;
      }
      if (filters.priority !== 'all' && item.priority !== filters.priority) {
        return false;
      }
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchConcept = item.concept.toLowerCase().includes(query);
        const creatorNames = creators
          .filter(c => item.creatorIds.includes(c.id))
          .map(c => c.name.toLowerCase())
          .join(' ');
        const matchCreator = creatorNames.includes(query);
        if (!matchTitle && !matchConcept && !matchCreator) {
          return false;
        }
      }
      return true;
    });
  }, [content, currentStoreId, filters, creators]);

  // Notifications derivation
  const notifications = useMemo(() => {
    const rawNotifications = storageService.generateNotifications(filteredContent);
    return rawNotifications.map(n => ({
      ...n,
      read: readNotificationIds.includes(n.id)
    }));
  }, [filteredContent, readNotificationIds]);

  const markNotificationAsRead = (id: string) => {
    if (!readNotificationIds.includes(id)) {
      const updated = [...readNotificationIds, id];
      setReadNotificationIds(updated);
      localStorage.setItem('reelflow_read_notifs', JSON.stringify(updated));
    }
  };

  const currentStore = useMemo(() => {
    if (currentStoreId === 'all') return null;
    return stores.find(s => s.id === currentStoreId) || null;
  }, [stores, currentStoreId]);

  return (
    <AppContext.Provider
      value={{
        stores,
        creators,
        categories,
        content,
        notifications,
        currentStoreId,
        setCurrentStoreId,
        viewMode,
        setViewMode,
        enterApp,
        goToLanding,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        isLoading,
        filters,
        setFilters,
        resetFilters,
        isAddContentOpen,
        setIsAddContentOpen,
        addContentPrefill,
        openAddContent,
        editingContent,
        setEditingContent,
        isEditContentOpen,
        setIsEditContentOpen,
        openEditContent,
        closeEditContent,
        duplicateContent,
        isFilterSheetOpen,
        setIsFilterSheetOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        markNotificationAsRead,
        selectedCreatorId,
        setSelectedCreatorId,
        selectedContentId,
        setSelectedContentId,
        addContent,
        updateContent,
        deleteContent,
        updateShootStatus,
        updatePostStatus,
        addCreator,
        updateCreator,
        deleteCreator,
        addStore,
        updateStore,
        addCategory,
        seedSampleDatabase,
        filteredContent,
        currentStore
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
