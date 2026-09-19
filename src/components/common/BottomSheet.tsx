import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxHeight?: string;
  footer?: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxHeight = 'calc(100svh - 3rem)',
  footer
}) => {
  const isBackdropClickRef = useRef(false);

  // Handle escape key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* Full Screen Backdrop with Click Origin Guard */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity animate-fade-in"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            isBackdropClickRef.current = true;
          }
        }}
        onTouchStart={(e) => {
          if (e.target === e.currentTarget) {
            isBackdropClickRef.current = true;
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (isBackdropClickRef.current && e.target === e.currentTarget) {
            isBackdropClickRef.current = false;
            onClose();
          }
          isBackdropClickRef.current = false;
        }}
      />

      {/* Sheet / Modal Content - Docks to bottom on mobile, centered modal on tablet/desktop */}
      <div
        className="relative z-10 w-full sm:max-w-lg bg-slate-900 border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-sheet-up sm:animate-slide-up ring-1 ring-white/10"
        style={{ maxHeight }}
        onMouseDown={(e) => {
          isBackdropClickRef.current = false;
          e.stopPropagation();
        }}
        onTouchStart={(e) => {
          isBackdropClickRef.current = false;
          e.stopPropagation();
        }}
        onClick={(e) => {
          isBackdropClickRef.current = false;
          e.stopPropagation();
        }}
      >
        {/* Drag Handle Indicator for Mobile (Visual only) */}
        <div className="w-full flex items-center justify-center pt-3 pb-1 sm:hidden shrink-0 pointer-events-none">
          <div className="w-12 h-1.5 bg-slate-600 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 shrink-0 bg-slate-900">
            <div className="min-w-0 flex-1 pr-2">
              <h3 className="text-sm sm:text-base font-bold text-gray-100 truncate">{title}</h3>
              {subtitle && <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="touch-target-44 p-2 text-gray-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Body - Touch-friendly scrolling with safe bottom padding on mobile if no footer */}
        <div className={`p-4 sm:p-5 overflow-y-auto flex-1 ${footer ? '' : 'pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))]'}`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-4 py-3 sm:px-5 sm:py-4 border-t border-slate-800 bg-slate-900 pb-[max(1rem,calc(env(safe-area-inset-bottom)+0.75rem))] shrink-0 z-20">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};


