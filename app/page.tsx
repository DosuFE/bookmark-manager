'use client';

import { useEffect, useState, useMemo } from 'react';
import { Bookmark, SortOption } from './types';
import BookmarkCard from './components/BookmarkCard';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import AddBookmarkForm from './components/AddBookmarkForm';
// import ThemeToggle from './components/ThemeToggle';
import SortDropdown from './components/SortDropdown';

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('recently-added');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

  // Load data on mount
  useEffect(() => {
    fetch('http://localhost:5000/bookmark')
      .then((res) => res.json())
      .then((data) => setBookmarks(data))
      .catch(() => console.error('Failed to load bookmarks'));
  }, []);

  // Set theme on mount
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Sync dark class with isDark state
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Filter and sort bookmarks
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    bookmarks.forEach((b) => b.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [bookmarks]);

  useEffect(() => {
    let filtered = showArchived
      ? bookmarks.filter((b) => b.archived)
      : bookmarks.filter((b) => !b.archived);

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((b) =>
        selectedTags.some((tag) => b.tags.includes(tag))
      );
    }

    // Sort
    if (sortOption === 'recently-added') {
      filtered.sort(
        (a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      );
    } else if (sortOption === 'recently-visited') {
      filtered.sort(
        (a, b) =>
          new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime()
      );
    } else if (sortOption === 'most-visited') {
      filtered.sort((a, b) => b.viewCount - a.viewCount);
    }

    // Pin pinned bookmarks at the top
    filtered.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    setFilteredBookmarks(filtered);
  }, [bookmarks, searchQuery, selectedTags, showArchived, sortOption]);

  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
  };

  const handleAddBookmark = (bookmark: Bookmark) => {
    if (editingBookmark) {
      setBookmarks(
        bookmarks.map((b) => (b.id === bookmark.id ? bookmark : b))
      );
      setEditingBookmark(null);
    } else {
      setBookmarks([...bookmarks, { ...bookmark, id: Date.now().toString() }]);
    }
    setShowAddForm(false);
  };

  const handleDeleteBookmark = async (id: string) => {
    await fetch(`http://localhost:5000/bookmark/${id}`, { method: 'DELETE' });
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleArchiveBookmark = (id: string) => {
    setBookmarks(
      bookmarks.map((b) =>
        b.id === id ? { ...b, archived: !b.archived } : b
      )
    );
  };

  const handlePinBookmark = (id: string) => {
    setBookmarks(
      bookmarks.map((b) =>
        b.id === id ? { ...b, pinned: !b.pinned } : b
      )
    );
  };

  const handleVisitBookmark = (id: string) => {
    setBookmarks(
      bookmarks.map((b) =>
        b.id === id
          ? {
              ...b,
              viewCount: b.viewCount + 1,
              lastVisited: new Date().toISOString(),
            }
          : b
      )
    );
  };

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setShowAddForm(true);
  };

  return (
    <div className="min-h-screen transition-colors duration-200">
      <div className="flex flex-col lg:flex-row h-screen bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50">
        {/* Sidebar */}
        <div className={`${showSidebarMobile ? 'block' : 'hidden'} lg:block absolute lg:static top-16 left-0 right-0 z-40 lg:z-0`}>
          <Sidebar
            allTags={allTags}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            showArchived={showArchived}
            onShowArchivedChange={setShowArchived}
            onResetFilters={() => {
              setSelectedTags([]);
              setSearchQuery('');
            }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button
                onClick={() => setShowSidebarMobile(!showSidebarMobile)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                title="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold truncate">
                {showArchived ? 'Archived' : 'Bookmarks'}
              </h1>
            </div>
            <button
              onClick={() => {
                setEditingBookmark(null);
                setShowAddForm(true);
              }}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors whitespace-nowrap"
            >
              + Add Bookmark
            </button>
            {/* <ThemeToggle isDark={isDark} onToggle={toggleTheme} /> */}
          </div>

          {/* Search & Sort Bar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-8 py-3 flex gap-4 items-center flex-wrap">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <SortDropdown value={sortOption} onChange={setSortOption} />
          </div>

          {/* Bookmarks Grid */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            {filteredBookmarks.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    No bookmarks found
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {searchQuery && !selectedTags.length
                      ? 'Try a different search term'
                      : selectedTags.length && !searchQuery
                      ? 'Try selecting different tags'
                      : 'Add your first bookmark to get started'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onVisit={() => handleVisitBookmark(bookmark.id)}
                    onPin={() => handlePinBookmark(bookmark.id)}
                    onArchive={() => handleArchiveBookmark(bookmark.id)}
                    onEdit={() => handleEditBookmark(bookmark)}
                    onDelete={() => handleDeleteBookmark(bookmark.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Bookmark Modal */}
      {showAddForm && (
        <AddBookmarkForm
          bookmark={editingBookmark}
          onSubmit={handleAddBookmark}
          onClose={() => {
            setShowAddForm(false);
            setEditingBookmark(null);
          }}
        />
      )}
    </div>
  );
}
