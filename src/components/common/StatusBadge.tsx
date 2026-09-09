import React from 'react';
import { ShootStatus, PostStatus } from '../../types';
import { Circle, Clock, CheckCircle2, Video, Sparkles, Send, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  type: 'shoot' | 'post';
  status: ShootStatus | PostStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, status, size = 'md' }) => {
  const isSm = size === 'sm';
  const paddingClass = isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  if (type === 'shoot') {
    const shootStatus = status as ShootStatus;
    switch (shootStatus) {
      case 'Not Started':
        return (
          <span className={`badge ${paddingClass}`} style={{ backgroundColor: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
            <Circle className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
            Not Started
          </span>
        );
      case 'Scheduled':
        return (
          <span className={`badge ${paddingClass}`} style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <Clock className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
            Scheduled
          </span>
        );
      case 'Shot':
        return (
          <span className={`badge ${paddingClass}`} style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <CheckCircle2 className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
            Shot
          </span>
        );
      case 'Cancelled':
        return (
          <span className={`badge ${paddingClass}`} style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <XCircle className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  }

  // Post Statuses
  const postStatus = status as PostStatus;
  switch (postStatus) {
    case 'Pending':
      return (
        <span className={`badge ${paddingClass}`} style={{ backgroundColor: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
          <Clock className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          Pending
        </span>
      );
    case 'Editing':
      return (
        <span className={`badge ${paddingClass}`} style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <Video className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          Editing
        </span>
      );
    case 'Ready':
      // "Ready" explicitly means completely edited and ready to post on social media!
      return (
        <span className={`badge ${paddingClass}`} style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', fontWeight: 700 }}>
          <Sparkles className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          Ready to Post
        </span>
      );
    case 'Posted':
      return (
        <span className={`badge ${paddingClass}`} style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <Send className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          Posted
        </span>
      );
    case 'Cancelled':
      return (
        <span className={`badge ${paddingClass}`} style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <XCircle className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          Cancelled
        </span>
      );
    default:
      return null;
  }
};
