export type ShootStatus = 'Not Started' | 'Scheduled' | 'Shot' | 'Cancelled';

export type PostStatus = 'Pending' | 'Editing' | 'Ready' | 'Posted' | 'Cancelled';

export type Priority = 'Low' | 'Normal' | 'High' | 'Urgent';

export type ViewMode = 'landing' | 'app';

export type ActiveTab = 'dashboard' | 'calendar' | 'content' | 'creators' | 'analytics' | 'pending' | 'my_assignments';

export type CalendarViewMode = 'month' | 'week' | 'list';

export type UserRole = 'super_admin' | 'super' | 'admin' | 'creator' | 'unassigned';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  creatorId?: string; // Auto-linked Creator ID if role == 'creator'
  assignedStoreIds?: string[]; // Allowed store IDs if role == 'admin'
  createdAt?: string;
  updatedAt?: string;
}

export interface Store {
  id: string;
  name: string;
  code: string;
  logo: string;
  primaryColor: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface Creator {
  id: string;
  storeIds: string[];
  name: string;
  username: string;
  profileImage: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
  bio?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  iconName?: string;
  color: string;
  isDefault?: boolean;
}

export interface ContentItem {
  id: string;
  storeId: string;
  title: string;
  concept: string;
  categoryId: string;
  creatorIds: string[];
  shootDate: string;
  postDate: string;
  shootStatus: ShootStatus;
  postStatus: PostStatus;
  priority: Priority;
  notes?: string;
  referenceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  type: 'shoot_today' | 'post_today' | 'overdue_shoot' | 'overdue_post' | 'ready_to_post';
  title: string;
  message: string;
  contentId: string;
  date: string;
  read: boolean;
}

export interface FilterState {
  storeId: string;
  creatorId: string;
  categoryId: string;
  shootStatus: string;
  postStatus: string;
  priority: string;
  searchQuery: string;
  datePreset: 'all' | 'today' | 'this_week' | 'this_month' | 'overdue';
}
