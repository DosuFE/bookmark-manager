'use client';

import { Bookmark } from '../types';

interface TopBarProps {
  title: string;
  onAddBookmark: () => void;
}

export default function TopBar({
  title,
  onAddBookmark,
}: TopBarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
      <h1 className="text-xl sm:text-2xl font-bold truncate">{title}</h1>
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onAddBookmark}
          className="px-3 sm:px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors whitespace-nowrap text-sm sm:text-base"
        >
          + Add
        </button>
      </div>
    </div>
  );
}
