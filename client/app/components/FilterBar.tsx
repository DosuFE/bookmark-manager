'use client';

import SearchBar from './SearchBar';
import SortDropdown from './SortDropdown';
import { SortOption } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-3 flex gap-4 items-center flex-wrap">
      <div className="flex-1 min-w-0 sm:min-w-[200px]">
        <SearchBar value={searchQuery} onChange={onSearchChange} />
      </div>
      <SortDropdown value={sortOption} onChange={onSortChange} />
    </div>
  );
}
