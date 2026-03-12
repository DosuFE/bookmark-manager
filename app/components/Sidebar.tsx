'use client';

interface SidebarProps {
  allTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  showArchived: boolean;
  onShowArchivedChange: (show: boolean) => void;
  onResetFilters: () => void;
}

export default function Sidebar({
  allTags,
  selectedTags,
  onTagsChange,
  showArchived,
  onShowArchivedChange,
  onResetFilters,
}: SidebarProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="w-full lg:w-64 bg-white dark:bg-gray-800 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex-shrink-0">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Logo/Title */}
        <div>
          <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            Bookmarks
          </h2>
        </div>

        {/* Filters Header */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-gray-50">
              Filters
            </h3>
            {(selectedTags.length > 0) && (
              <button
                onClick={onResetFilters}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
              >
                Reset
              </button>
            )}
          </div>

          {/* Archive Toggle */}
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-colors mb-2">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => onShowArchivedChange(e.target.checked)}
              className="w-4 h-4 accent-blue-600 dark:accent-blue-500 rounded cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Archived
            </span>
          </label>
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
              Tags
            </h4>
            <div className="space-y-2">
              {allTags.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className="w-4 h-4 accent-blue-600 dark:accent-blue-500 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
