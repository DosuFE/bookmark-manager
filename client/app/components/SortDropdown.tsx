'use client';

import { SortOption } from '../types';

interface SortDropdownProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-colors cursor-pointer"
    >
      <option value="recently-added">Recently Added</option>
      <option value="recently-visited">Recently Visited</option>
      <option value="most-visited">Most Visited</option>
    </select>
  );
}
