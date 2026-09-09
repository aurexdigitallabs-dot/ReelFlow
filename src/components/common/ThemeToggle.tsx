import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark/light mode"
      className="flex items-center gap-1 p-2 rounded-full hover:bg-slate-800/30 transition-colors"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-400" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-400" />
      )}
    </button>
  );
};
