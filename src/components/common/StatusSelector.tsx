import React, { useState, useRef, useEffect } from 'react';
import { ShootStatus, PostStatus } from '../../types';
import { StatusBadge } from './StatusBadge';
import { ChevronDown, Check, Lock } from 'lucide-react';

interface StatusSelectorProps {
  type: 'shoot' | 'post';
  currentStatus: ShootStatus | PostStatus;
  onStatusChange: (status: any) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

const SHOOT_OPTIONS: ShootStatus[] = ['Not Started', 'Scheduled', 'Shot', 'Cancelled'];
const POST_OPTIONS: PostStatus[] = ['Pending', 'Editing', 'Ready', 'Posted', 'Cancelled'];

export const StatusSelector: React.FC<StatusSelectorProps> = ({
  type,
  currentStatus,
  onStatusChange,
  size = 'md',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options = type === 'shoot' ? SHOOT_OPTIONS : POST_OPTIONS;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (disabled) {
    return (
      <div className="inline-flex items-center gap-1 opacity-80" title="Read-only: You are not assigned to this content item">
        <StatusBadge type={type} status={currentStatus} size={size} />
        <Lock className="w-3 h-3 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="inline-flex items-center gap-1.5 focus:outline-none rounded-lg hover:opacity-95 transition-opacity"
        title="Tap to change status"
      >
        <StatusBadge type={type} status={currentStatus} size={size} />
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 left-0 mt-1 min-w-[160px] glass-panel p-1.5 shadow-lg animate-fade-in"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-hover)',
            boxShadow: 'var(--shadow-lg)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700/50 mb-1">
            Change {type === 'shoot' ? 'Shoot' : 'Post'} Status
          </div>
          <div className="flex flex-col gap-1">
            {options.map((option) => {
              const isSelected = option === currentStatus;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onStatusChange(option);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md w-full text-left transition-colors ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-400 font-semibold'
                      : 'hover:bg-gray-700/40 text-gray-300'
                  }`}
                >
                  <StatusBadge type={type} status={option} size="sm" />
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
