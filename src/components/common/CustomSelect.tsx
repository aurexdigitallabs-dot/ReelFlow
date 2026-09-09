import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface CustomSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  color?: string;
}

interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  label,
  required,
  searchable = false,
  searchPlaceholder = 'Search...',
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [coords, setCoords] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    maxHeight: number;
  }>({ left: 0, width: 200, maxHeight: 240 });

  const selectedOption = options.find((opt) => opt.value === value);

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      const estimatedMenuHeight = Math.min(240, options.length * 36 + (searchable ? 44 : 0) + 16);
      const shouldOpenUp = spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;

      if (shouldOpenUp) {
        setCoords({
          bottom: viewportHeight - rect.top + 4,
          left: Math.max(8, rect.left),
          width: Math.min(rect.width, window.innerWidth - 16),
          maxHeight: Math.min(240, Math.max(120, spaceAbove - 12))
        });
      } else {
        setCoords({
          top: rect.bottom + 4,
          left: Math.max(8, rect.left),
          width: Math.min(rect.width, window.innerWidth - 16),
          maxHeight: Math.min(240, Math.max(120, spaceBelow - 12))
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
  }, [isOpen, options.length, searchable]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen, searchable]);

  const filteredOptions = searchable && searchQuery.trim()
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : options;

  const dropdownMenu = (
    <>
      {/* Invisible backdrop to dismiss on click outside */}
      <div
        className="fixed inset-0 z-[99998] cursor-default"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
      />

      {/* Portaled Dropdown floating menu */}
      <div
        className="fixed z-[99999] bg-slate-900 border border-slate-700/90 rounded-xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col animate-fade-in ring-1 ring-white/10"
        style={{
          ...(coords.top !== undefined ? { top: `${coords.top}px` } : {}),
          ...(coords.bottom !== undefined ? { bottom: `${coords.bottom}px` } : {}),
          left: `${coords.left}px`,
          width: `${coords.width}px`,
          maxHeight: `${coords.maxHeight}px`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {searchable && (
          <div className="p-2 border-b border-slate-800 bg-slate-950/80 sticky top-0 z-10 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full text-xs bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none pr-1"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        <div className="overflow-y-auto p-1 flex-1 divide-y divide-slate-800/40">
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-center text-xs text-gray-500">
              No matching options found
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                      : 'text-gray-300 hover:bg-slate-800 hover:text-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate min-w-0 pr-2">
                    {opt.color && (
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: opt.color }}
                      />
                    )}
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
                    {opt.sublabel && (
                      <span className="text-[10px] text-gray-500 truncate">
                        {opt.sublabel}
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-gray-300 mb-1">
          {label} {required && <span className="text-indigo-400">*</span>}
        </label>
      )}

      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          updateCoords();
          setIsOpen(!isOpen);
        }}
        className={`w-full px-3 py-2 text-xs bg-slate-950 border rounded-xl flex items-center justify-between text-left transition-all ${
          isOpen
            ? 'border-indigo-500 ring-2 ring-indigo-500/20 text-gray-100 bg-slate-900'
            : 'border-slate-800 hover:border-slate-700 text-gray-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="flex items-center gap-2 truncate pr-2 min-w-0">
          {selectedOption?.color && (
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: selectedOption.color }}
            />
          )}
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : <span className="text-gray-500">{placeholder}</span>}
          </span>
          {selectedOption?.sublabel && (
            <span className="text-[10px] text-gray-500 truncate hidden sm:inline">
              {selectedOption.sublabel}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-indigo-400' : ''
          }`}
        />
      </button>

      {isOpen && createPortal(dropdownMenu, document.body)}
    </div>
  );
};

