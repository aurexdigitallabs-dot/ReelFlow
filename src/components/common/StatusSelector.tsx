import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    right: number;
    maxHeight: number;
  }>({ left: 0, right: 0, maxHeight: 260 });

  const options = type === 'shoot' ? SHOOT_OPTIONS : POST_OPTIONS;

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const estimatedHeight = type === 'shoot' ? 180 : 210;

      const shouldOpenUp = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

      if (shouldOpenUp) {
        setCoords({
          bottom: viewportHeight - rect.top + 4,
          left: rect.left,
          right: window.innerWidth - rect.right,
          maxHeight: Math.min(260, Math.max(140, spaceAbove - 12))
        });
      } else {
        setCoords({
          top: rect.bottom + 4,
          left: rect.left,
          right: window.innerWidth - rect.right,
          maxHeight: Math.min(260, Math.max(140, spaceBelow - 12))
        });
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      const handleScrollOrResize = () => updateCoords();
      window.addEventListener('resize', handleScrollOrResize);
      window.addEventListener('scroll', handleScrollOrResize, true);
      return () => {
        window.removeEventListener('resize', handleScrollOrResize);
        window.removeEventListener('scroll', handleScrollOrResize, true);
      };
    }
  }, [isOpen]);

  if (disabled) {
    return (
      <div className="inline-flex items-center gap-1 opacity-80" title="Read-only: You are not assigned to this content item">
        <StatusBadge type={type} status={currentStatus} size={size} />
        <Lock className="w-3 h-3 text-gray-500" />
      </div>
    );
  }

  const dropdownMenu = (
    <>
      {/* Fixed Backdrop overlay to catch clicks outside */}
      <div
        className="fixed inset-0 z-[99998] cursor-default"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
      />

      {/* Portaled Dropdown Menu attached to document.body at fixed z-[99999] */}
      <div
        className="fixed z-[99999] min-w-[165px] bg-slate-900 border border-slate-700/90 rounded-xl p-1.5 shadow-2xl shadow-black/90 animate-fade-in ring-1 ring-white/10 overflow-y-auto"
        style={{
          ...(coords.top !== undefined ? { top: `${coords.top}px` } : {}),
          ...(coords.bottom !== undefined ? { bottom: `${coords.bottom}px` } : {}),
          maxHeight: `${coords.maxHeight}px`,
          ...(window.innerWidth < 640 || coords.left + 165 > window.innerWidth
            ? { right: `${Math.max(8, coords.right)}px` }
            : { left: `${Math.max(8, coords.left)}px` })
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
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(option);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md w-full text-left transition-colors cursor-pointer ${
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
    </>
  );

  return (
    <div className="inline-block relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          updateCoords();
          setIsOpen(!isOpen);
        }}
        className="inline-flex items-center gap-1.5 focus:outline-none rounded-lg hover:opacity-95 transition-opacity cursor-pointer"
        title="Tap to change status"
      >
        <StatusBadge type={type} status={currentStatus} size={size} />
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {isOpen && createPortal(dropdownMenu, document.body)}
    </div>
  );
};
