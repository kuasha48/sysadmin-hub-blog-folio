import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useBlogTheme } from '@/hooks/useBlogTheme';

interface Props {
  className?: string;
}

const BlogThemeToggle: React.FC<Props> = ({ className = '' }) => {
  const { isDark, toggle } = useBlogTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
        isDark
          ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
      } ${className}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
};

export default BlogThemeToggle;
