import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { Store, Creator, Category, ContentItem, ShootStatus, PostStatus } from '../types';
import { INITIAL_STORES, INITIAL_CATEGORIES, INITIAL_CREATORS } from '../data/seedData';

const COLLECTIONS = {
  STORES: 'stores',
  CREATORS: 'creators',
  CATEGORIES: 'categories',
  CONTENT: 'content'
};

// Utility to strip undefined properties before saving to Firestore
function cleanFirestoreData<T extends Record<string, any>>(obj: T): T {
  const cleaned: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned as T;
}

export const dbService = {
  // Real-time Store Subscriptions
  subscribeStores(onData: (stores: Store[]) => void): Unsubscribe {
    const q = query(collection(db, COLLECTIONS.STORES));
    return onSnapshot(q, (snapshot) => {
      const stores: Store[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      } as Store));
      onData(stores);
    }, (error) => {
      console.error('Error fetching stores from Firestore:', error);
      onData([]);
    });
  },

  // Real-time Creator Subscriptions
  subscribeCreators(onData: (creators: Creator[]) => void): Unsubscribe {
    const q = query(collection(db, COLLECTIONS.CREATORS));
    return onSnapshot(q, (snapshot) => {
      const creators: Creator[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      } as Creator));
      onData(creators);
    }, (error) => {
      console.error('Error fetching creators from Firestore:', error);
      onData([]);
    });
  },

  // Real-time Category Subscriptions
  subscribeCategories(onData: (categories: Category[]) => void): Unsubscribe {
    const q = query(collection(db, COLLECTIONS.CATEGORIES));
    return onSnapshot(q, (snapshot) => {
      const categories: Category[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      } as Category));
      onData(categories);
    }, (error) => {
      console.error('Error fetching categories from Firestore:', error);
      onData([]);
    });
  },

  // Real-time Content Subscriptions
  subscribeContent(onData: (content: ContentItem[]) => void): Unsubscribe {
    const q = query(collection(db, COLLECTIONS.CONTENT));
    return onSnapshot(q, (snapshot) => {
      const contentList: ContentItem[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      } as ContentItem));
      onData(contentList);
    }, (error) => {
      console.error('Error fetching content from Firestore:', error);
      onData([]);
    });
  },

  // Store CRUD
  async addStore(storeData: Omit<Store, 'id' | 'createdAt'>): Promise<string> {
    const newRef = doc(collection(db, COLLECTIONS.STORES));
    const storeItem: Store = cleanFirestoreData({
      ...storeData,
      id: newRef.id,
      createdAt: new Date().toISOString()
    });
    await setDoc(newRef, storeItem);
    return newRef.id;
  },

  async updateStore(id: string, updates: Partial<Store>): Promise<void> {
    const ref = doc(db, COLLECTIONS.STORES, id);
    await updateDoc(ref, cleanFirestoreData(updates));
  },

  async deleteStore(id: string): Promise<void> {
    const ref = doc(db, COLLECTIONS.STORES, id);
    await deleteDoc(ref);
  },

  // Creator CRUD
  async addCreator(creatorData: Omit<Creator, 'id' | 'createdAt'>): Promise<string> {
    const avatarLen = creatorData.profileImage ? creatorData.profileImage.length : 0;
    const isBase64 = creatorData.profileImage?.startsWith('data:');
    console.log('📝 [dbService.addCreator] Initiating write to Firestore...', {
      name: creatorData.name,
      email: creatorData.email,
      username: creatorData.username,
      avatarType: isBase64 ? `base64 (${Math.round(avatarLen / 1024)} KB)` : 'URL',
      storeIds: creatorData.storeIds
    });

    try {
      const newRef = doc(collection(db, COLLECTIONS.CREATORS));
      const creatorItem: Creator = cleanFirestoreData({
        ...creatorData,
        id: newRef.id,
        createdAt: new Date().toISOString()
      });
      
      console.log('⏳ [dbService.addCreator] Writing to path: creators/' + newRef.id);
      await setDoc(newRef, creatorItem);
      console.log('✅ [dbService.addCreator] Successfully saved creator to Firestore with ID:', newRef.id);
      return newRef.id;
    } catch (err: any) {
      console.error('❌ [dbService.addCreator] Firestore rejected write:', {
        errorCode: err?.code,
        errorMessage: err?.message,
        errorName: err?.name,
        fullError: err
      });
      throw err;
    }
  },

  async updateCreator(id: string, updates: Partial<Creator>): Promise<void> {
    const ref = doc(db, COLLECTIONS.CREATORS, id);
    await updateDoc(ref, cleanFirestoreData(updates));
  },

  async deleteCreator(id: string): Promise<void> {
    const ref = doc(db, COLLECTIONS.CREATORS, id);
    await deleteDoc(ref);
  },

  // Category CRUD
  async addCategory(catData: Omit<Category, 'id'>): Promise<string> {
    const newRef = doc(collection(db, COLLECTIONS.CATEGORIES));
    const catItem: Category = cleanFirestoreData({
      ...catData,
      id: newRef.id
    });
    await setDoc(newRef, catItem);
    return newRef.id;
  },

  // Content CRUD
  async addContent(contentData: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const newRef = doc(collection(db, COLLECTIONS.CONTENT));
    const now = new Date().toISOString();
    const contentItem: ContentItem = cleanFirestoreData({
      ...contentData,
      id: newRef.id,
      createdAt: now,
      updatedAt: now
    });
    await setDoc(newRef, contentItem);
    return newRef.id;
  },

  async updateContent(id: string, updates: Partial<ContentItem>): Promise<void> {
    const ref = doc(db, COLLECTIONS.CONTENT, id);
    await updateDoc(ref, cleanFirestoreData({
      ...updates,
      updatedAt: new Date().toISOString()
    }));
  },

  async deleteContent(id: string): Promise<void> {
    const ref = doc(db, COLLECTIONS.CONTENT, id);
    await deleteDoc(ref);
  },


  async updateShootStatus(id: string, shootStatus: ShootStatus): Promise<void> {
    await this.updateContent(id, { shootStatus });
  },

  async updatePostStatus(id: string, postStatus: PostStatus): Promise<void> {
    await this.updateContent(id, { postStatus });
  },

  // Seed default categories and sample store if DB is completely fresh
  async seedInitialDefaults(): Promise<void> {
    // Seed default categories
    for (const cat of INITIAL_CATEGORIES) {
      await setDoc(doc(db, COLLECTIONS.CATEGORIES, cat.id), cat);
    }
    // Seed sample stores
    for (const s of INITIAL_STORES) {
      await setDoc(doc(db, COLLECTIONS.STORES, s.id), s);
    }
    // Seed sample creators
    for (const c of INITIAL_CREATORS) {
      await setDoc(doc(db, COLLECTIONS.CREATORS, c.id), c);
    }
  }
};
