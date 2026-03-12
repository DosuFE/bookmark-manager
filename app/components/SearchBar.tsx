'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex-1 min-w-0 lg:min-w-64">
      <input
        type="text"
        placeholder="Search bookmarks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-50 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-colors"
      />
    </div>
  );
}
