import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Store, Creator, Category, ContentItem, AppNotification, FilterState, ActiveTab, ViewMode, ShootStatus, PostStatus } from '../types';
import { dbService } from '../services/dbService';
import { storageService } from '../services/storageService';
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
  
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (open: boolean) => void;
  
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  
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
  const [currentStoreId, setCurrentStoreIdState] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [addContentPrefill, setAddContentPrefill] = useState<Partial<ContentItem> | null>(null);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);

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

  // Notifications derivation
  const notifications = useMemo(() => {
    return storageService.generateNotifications(content);
  }, [content]);

  const setCurrentStoreId = (id: string) => {
    setCurrentStoreIdState(id);
    setFilters(prev => ({ ...prev, storeId: id }));
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
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
  };

  // Real DB Creator Actions
  const addCreator = async (creatorData: Omit<Creator, 'id' | 'createdAt'>) => {
    await dbService.addCreator(creatorData);
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
        isFilterSheetOpen,
        setIsFilterSheetOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
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
