'use client';

import { Bookmark } from '../types';
import BookmarkCard from './BookmarkCard';

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  onVisit: (id: string) => void;
  onPin: (id: string) => void;
  onArchive: (id: string) => void;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
}

export default function BookmarkGrid({
  bookmarks,
  onVisit,
  onPin,
  onArchive,
  onEdit,
  onDelete,
}: BookmarkGridProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No bookmarks found
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Add your first bookmark to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onVisit={() => onVisit(bookmark.id)}
          onPin={() => onPin(bookmark.id)}
          onArchive={() => onArchive(bookmark.id)}
          onEdit={() => onEdit(bookmark)}
          onDelete={() => onDelete(bookmark.id)}
        />
      ))}
    </div>
  );
}
