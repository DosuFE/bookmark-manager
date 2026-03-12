'use client';

import { Bookmark } from '../types';
import Link from 'next/link';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onVisit: () => void;
  onPin: () => void;
  onArchive: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function BookmarkCard({
  bookmark,
  onVisit,
  onPin,
  onArchive,
  onEdit,
  onDelete,
}: BookmarkCardProps) {
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(bookmark.url);
    // Could add a toast notification here
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg dark:shadow-lg dark:hover:shadow-xl transition-shadow duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
      {/* Header with favicon and title */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3 mb-2">
          <img
            src={bookmark.favicon}
            alt={bookmark.title}
            className="w-6 h-6 rounded flex-shrink-0 mt-1"
            onError={(e) => {
              e.currentTarget.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/%3E%3C/svg%3E';
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 truncate line-clamp-2">
              {bookmark.title}
            </h3>
          </div>
          {bookmark.pinned && (
            <span className="text-yellow-500 dark:text-yellow-400 text-lg flex-shrink-0">
              📌
            </span>
          )}
        </div>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate block"
          title={bookmark.url}
        >
          {bookmark.url.replace(/https?:\/\/(www\.)?/, '')}
        </a>
      </div>

      {/* Description */}
      <div className="px-4 py-3 flex-1">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {bookmark.description}
        </p>
      </div>

      {/* Tags */}
      {bookmark.tags.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
          {bookmark.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
        <div>
          <span className="font-medium">Views:</span> {bookmark.viewCount}
        </div>
        <div>
          <span className="font-medium">Added:</span> {formatDate(bookmark.dateAdded)}
        </div>
        <div className="col-span-2">
          <span className="font-medium">Last visited:</span>{' '}
          {formatDate(bookmark.lastVisited)}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
        <button
          onClick={() => {
            onVisit();
            window.open(bookmark.url, '_blank');
          }}
          className="flex-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 dark:bg-blue-700 rounded hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition-colors"
          title="Visit website"
        >
          Visit
        </button>
        <button
          onClick={handleCopyUrl}
          className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition-colors"
          title="Copy URL to clipboard"
        >
          📋
        </button>
        <button
          onClick={onPin}
          className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition-colors"
          title={bookmark.pinned ? 'Unpin' : 'Pin'}
        >
          {bookmark.pinned ? '📍' : '📌'}
        </button>
        <button
          onClick={onEdit}
          className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition-colors"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={onArchive}
          className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition-colors"
          title={bookmark.archived ? 'Unarchive' : 'Archive'}
        >
          📦
        </button>
        <button
          onClick={onDelete}
          className="px-2 py-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition-colors"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
