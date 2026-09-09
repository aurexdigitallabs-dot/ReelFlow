import { Store, Creator, Category, ContentItem } from '../types';
import { getTodayString } from '../utils/dateUtils';

// Helper to derive dates relative to today
function getDateOffset(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const todayStr = getTodayString();

export const INITIAL_STORES: Store[] = [];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-reel', name: 'Reel', color: '#8b5cf6', isDefault: true },
  { id: 'cat-carousel', name: 'Carousel', color: '#06b6d4', isDefault: true },
  { id: 'cat-story', name: 'Story', color: '#f59e0b', isDefault: true },
  { id: 'cat-vines', name: 'Vines', color: '#ef4444', isDefault: true },
  { id: 'cat-public', name: 'Public Interaction', color: '#3b82f6', isDefault: true },
  { id: 'cat-food', name: 'Food Content', color: '#ec4899', isDefault: true },
  { id: 'cat-product', name: 'Product Content', color: '#10b981', isDefault: true },
  { id: 'cat-collab', name: 'Collaboration', color: '#a855f7', isDefault: true },
  { id: 'cat-ad', name: 'Advertisement', color: '#64748b', isDefault: true },
  { id: 'cat-review', name: 'Review', color: '#14b8a6', isDefault: true },
  { id: 'cat-edu', name: 'Educational', color: '#f97316', isDefault: true },
  { id: 'cat-other', name: 'Other', color: '#94a3b8', isDefault: true }
];

export const INITIAL_CREATORS: Creator[] = [];

export const INITIAL_CONTENT: ContentItem[] = [];

