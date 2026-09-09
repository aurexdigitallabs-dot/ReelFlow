import { Store, Creator, Category, ContentItem, AppNotification } from '../types';
import { INITIAL_STORES, INITIAL_CATEGORIES, INITIAL_CREATORS, INITIAL_CONTENT } from '../data/seedData';
import { isShootOverdue, isPostOverdue, isToday, formatDate } from '../utils/dateUtils';

const KEYS = {
  STORES: 'cm_app_stores_v1',
  CREATORS: 'cm_app_creators_v1',
  CATEGORIES: 'cm_app_categories_v1',
  CONTENT: 'cm_app_content_v1',
  NOTIFICATIONS: 'cm_app_notifications_v1',
  CURRENT_STORE: 'cm_app_current_store_v1',
  THEME: 'cm_app_theme_v1'
};

export const storageService = {
  getStores(): Store[] {
    try {
      const data = localStorage.getItem(KEYS.STORES);
      if (!data) {
        localStorage.setItem(KEYS.STORES, JSON.stringify(INITIAL_STORES));
        return INITIAL_STORES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_STORES;
    }
  },

  saveStores(stores: Store[]) {
    localStorage.setItem(KEYS.STORES, JSON.stringify(stores));
  },

  getCreators(): Creator[] {
    try {
      const data = localStorage.getItem(KEYS.CREATORS);
      if (!data) {
        localStorage.setItem(KEYS.CREATORS, JSON.stringify(INITIAL_CREATORS));
        return INITIAL_CREATORS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CREATORS;
    }
  },

  saveCreators(creators: Creator[]) {
    localStorage.setItem(KEYS.CREATORS, JSON.stringify(creators));
  },

  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(KEYS.CATEGORIES);
      if (!data) {
        localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
        return INITIAL_CATEGORIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  saveCategories(categories: Category[]) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getContent(): ContentItem[] {
    try {
      const data = localStorage.getItem(KEYS.CONTENT);
      if (!data) {
        localStorage.setItem(KEYS.CONTENT, JSON.stringify(INITIAL_CONTENT));
        return INITIAL_CONTENT;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CONTENT;
    }
  },

  saveContent(content: ContentItem[]) {
    localStorage.setItem(KEYS.CONTENT, JSON.stringify(content));
  },

  getCurrentStoreId(): string {
    return localStorage.getItem(KEYS.CURRENT_STORE) || 'all';
  },

  saveCurrentStoreId(id: string) {
    localStorage.setItem(KEYS.CURRENT_STORE, id);
  },

  resetAllData() {
    localStorage.setItem(KEYS.STORES, JSON.stringify(INITIAL_STORES));
    localStorage.setItem(KEYS.CREATORS, JSON.stringify(INITIAL_CREATORS));
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(KEYS.CONTENT, JSON.stringify(INITIAL_CONTENT));
    localStorage.setItem(KEYS.CURRENT_STORE, 'all');
  },

  generateNotifications(contentItems: ContentItem[]): AppNotification[] {
    const notifications: AppNotification[] = [];

    contentItems.forEach(item => {
      // Shoot Today
      if (isToday(item.shootDate) && item.shootStatus === 'Scheduled') {
        notifications.push({
          id: `notif-shoot-today-${item.id}`,
          type: 'shoot_today',
          title: 'Shoot Scheduled Today',
          message: `"${item.title}" is scheduled to be shot today!`,
          contentId: item.id,
          date: item.shootDate,
          read: false
        });
      }

      // Post Today
      if (isToday(item.postDate) && item.postStatus === 'Ready') {
        notifications.push({
          id: `notif-post-today-${item.id}`,
          type: 'post_today',
          title: 'Ready to Post Today!',
          message: `"${item.title}" is edited & ready to publish today on social media.`,
          contentId: item.id,
          date: item.postDate,
          read: false
        });
      }

      // Overdue Shoot
      if (isShootOverdue(item.shootDate, item.shootStatus)) {
        notifications.push({
          id: `notif-overdue-shoot-${item.id}`,
          type: 'overdue_shoot',
          title: '⚠️ Shoot Overdue',
          message: `"${item.title}" shoot was scheduled for ${formatDate(item.shootDate)} but is not shot yet.`,
          contentId: item.id,
          date: item.shootDate,
          read: false
        });
      }

      // Overdue Post
      if (isPostOverdue(item.postDate, item.postStatus)) {
        notifications.push({
          id: `notif-overdue-post-${item.id}`,
          type: 'overdue_post',
          title: '⚠️ Posting Overdue',
          message: `"${item.title}" post date (${formatDate(item.postDate)}) passed but is not published.`,
          contentId: item.id,
          date: item.postDate,
          read: false
        });
      }
    });

    return notifications;
  }
};
