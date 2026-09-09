import { ContentItem, Creator, Category, ShootStatus, PostStatus } from '../types';
import { isShootOverdue, isPostOverdue } from './dateUtils';

export interface OverviewMetrics {
  totalContent: number;
  pendingShoot: number; // Not Started + Scheduled
  shot: number;
  editing: number;
  readyToPost: number; // PostStatus == Ready
  posted: number;
  overdueShootCount: number;
  overduePostCount: number;
  shootCompletionRate: number; // Shot / (Total - Cancelled Shoots)
  postCompletionRate: number; // Posted / (Total - Cancelled Posts)
}

export interface CategoryMetric {
  categoryId: string;
  categoryName: string;
  color: string;
  count: number;
  percentage: number;
}

export interface CreatorMetric {
  creatorId: string;
  creatorName: string;
  username: string;
  avatarUrl: string;
  assignedCount: number;
  shotCount: number;
  editingCount: number;
  readyCount: number;
  postedCount: number;
  pendingCount: number;
  completionRate: number;
}

export interface WeeklyTrendMetric {
  weekLabel: string;
  total: number;
  shot: number;
  posted: number;
  target: number;
}

export function calculateOverviewMetrics(items: ContentItem[]): OverviewMetrics {
  const totalContent = items.length;
  
  let pendingShoot = 0;
  let shot = 0;
  let editing = 0;
  let readyToPost = 0;
  let posted = 0;
  let overdueShootCount = 0;
  let overduePostCount = 0;
  let validShootTotal = 0;
  let validPostTotal = 0;

  items.forEach(item => {
    // Shoot counting
    if (item.shootStatus !== 'Cancelled') {
      validShootTotal++;
    }
    if (item.shootStatus === 'Not Started' || item.shootStatus === 'Scheduled') {
      pendingShoot++;
    } else if (item.shootStatus === 'Shot') {
      shot++;
    }

    // Post counting
    if (item.postStatus !== 'Cancelled') {
      validPostTotal++;
    }
    if (item.postStatus === 'Editing') {
      editing++;
    } else if (item.postStatus === 'Ready') {
      readyToPost++;
    } else if (item.postStatus === 'Posted') {
      posted++;
    }

    // Overdue counting
    if (isShootOverdue(item.shootDate, item.shootStatus)) {
      overdueShootCount++;
    }
    if (isPostOverdue(item.postDate, item.postStatus)) {
      overduePostCount++;
    }
  });

  const shootCompletionRate = validShootTotal > 0 ? Math.round((shot / validShootTotal) * 100) : 0;
  const postCompletionRate = validPostTotal > 0 ? Math.round((posted / validPostTotal) * 100) : 0;

  return {
    totalContent,
    pendingShoot,
    shot,
    editing,
    readyToPost,
    posted,
    overdueShootCount,
    overduePostCount,
    shootCompletionRate,
    postCompletionRate
  };
}

export function calculateCategoryMetrics(items: ContentItem[], categories: Category[]): CategoryMetric[] {
  const countMap: Record<string, number> = {};

  items.forEach(item => {
    countMap[item.categoryId] = (countMap[item.categoryId] || 0) + 1;
  });

  const total = items.length || 1;

  return categories
    .map(cat => {
      const count = countMap[cat.id] || 0;
      return {
        categoryId: cat.id,
        categoryName: cat.name,
        color: cat.color,
        count,
        percentage: Math.round((count / total) * 100)
      };
    })
    .filter(m => m.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function calculateCreatorMetrics(items: ContentItem[], creators: Creator[]): CreatorMetric[] {
  return creators.map(creator => {
    const assignedItems = items.filter(item => item.creatorIds.includes(creator.id));
    const totalAssigned = assignedItems.length;

    let shotCount = 0;
    let editingCount = 0;
    let readyCount = 0;
    let postedCount = 0;
    let pendingCount = 0;

    assignedItems.forEach(item => {
      if (item.shootStatus === 'Shot') shotCount++;
      if (item.postStatus === 'Editing') editingCount++;
      if (item.postStatus === 'Ready') readyCount++;
      if (item.postStatus === 'Posted') postedCount++;
      if (item.postStatus !== 'Posted' && item.postStatus !== 'Cancelled') pendingCount++;
    });

    const completionRate = totalAssigned > 0 ? Math.round((postedCount / totalAssigned) * 100) : 0;

    return {
      creatorId: creator.id,
      creatorName: creator.name,
      username: creator.username,
      avatarUrl: creator.profileImage,
      assignedCount: totalAssigned,
      shotCount,
      editingCount,
      readyCount,
      postedCount,
      pendingCount,
      completionRate
    };
  }).sort((a, b) => b.assignedCount - a.assignedCount);
}

export function calculateWeeklyTrends(items: ContentItem[]): WeeklyTrendMetric[] {
  if (!items || items.length === 0) {
    return [];
  }

  const now = new Date();
  const weeks: WeeklyTrendMetric[] = [];

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (i * 7 + 6));
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() - (i * 7));
    weekEnd.setHours(23, 59, 59, 999);

    const weekItems = items.filter(item => {
      const itemDate = new Date(item.shootDate || item.createdAt);
      return itemDate >= weekStart && itemDate <= weekEnd;
    });

    const shotCount = weekItems.filter(item => item.shootStatus === 'Shot').length;
    const postedCount = weekItems.filter(item => item.postStatus === 'Posted').length;
    const label = i === 0 ? 'Current Week' : `Week -${i}`;

    weeks.push({
      weekLabel: label,
      total: weekItems.length,
      shot: shotCount,
      posted: postedCount,
      target: Math.max(weekItems.length, 5)
    });
  }

  return weeks;
}
