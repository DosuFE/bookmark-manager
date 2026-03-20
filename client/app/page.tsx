'use client';

import { useEffect, useState, useMemo } from 'react';
import { Bookmark, SortOption } from './types';
import BookmarkCard from './components/BookmarkCard';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import AddBookmarkForm from './components/AddBookmarkForm';
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

  useEffect(() => {
    console.log('[Frontend] Fetching bookmarks...');
    fetch('/api/bookmarks', { cache: 'no-store' }) 
      .then((res: Response) => {
        console.log('[Frontend] Response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: unknown) => {
        console.log('[Frontend] Bookmarks loaded:', data);
        console.log('[Frontend] Is array?', Array.isArray(data));
        console.log('[Frontend] Array length:', Array.isArray(data) ? data.length : 'N/A');

        if (Array.isArray(data)) {
          const cleaned = data.map((b: any) => ({
            ...b,
            tags: Array.isArray(b.tags) ? b.tags : [],
          }));

          console.log('[Frontend] Cleaned bookmarks:', cleaned);
          setBookmarks(cleaned);
          setFilteredBookmarks(cleaned); 
        } else {
          console.log('[Frontend] Data is not an array');
          setBookmarks([]);
          setFilteredBookmarks([]);
        }
      })
      .catch((err: Error) => console.error('[Frontend] Failed to load bookmarks:', err));
  }, []);

  // Theme
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    bookmarks.forEach((b) => {
      if (Array.isArray(b.tags)) {
        b.tags.forEach((t) => tags.add(t));
      }
    });
    return Array.from(tags).sort();
  }, [bookmarks]);

  //  FILTER + SORT (SAFE)
  useEffect(() => {
    let filtered = showArchived
      ? bookmarks.filter((b) => b.archived)
      : bookmarks.filter((b) => !b.archived);

    // search
    if (searchQuery) {
      filtered = filtered.filter((b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    //  FIXED TAG FILTER
    if (selectedTags.length > 0) {
      filtered = filtered.filter((b) =>
        Array.isArray(b.tags) &&
        selectedTags.some((tag) => b.tags.includes(tag))
      );
    }

    // sort
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

    // pin first
    filtered.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    setFilteredBookmarks(filtered);
  }, [bookmarks, searchQuery, selectedTags, showArchived, sortOption]);

  // ACTIONS (unchanged)
  const handleAddBookmark = async (bookmark: Omit<Bookmark, 'id'> | Bookmark) => {
    if ('id' in bookmark) {
      try {
        const res = await fetch('/api/bookmarks', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookmark),
        });
        const updatedBookmark = await res.json();
        setBookmarks(bookmarks.map(b => b.id === bookmark.id ? updatedBookmark : b));
      } catch (error) {
        console.error('Failed to update bookmark', error);
      }
    } else {
      try {
        const res = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookmark),
        });
        const newBookmark = await res.json();
        setBookmarks([...bookmarks, newBookmark]);
      } catch (error) {
        console.error('Failed to add bookmark', error);
      }
    }
    setEditingBookmark(null);
    setShowAddForm(false);
  };

  const handleDeleteBookmark = async (id: number) => {
    try {
      await fetch(`/api/bookmarks?id=${id}`, { method: 'DELETE' });
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error('Failed to delete bookmark', error);
    }
  };

  const handleArchiveBookmark = async (id: number) => {
    const bookmark = bookmarks.find(b => b.id === id);
    if (!bookmark) return;

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, archived: !bookmark.archived }),
      });
      const updated = await res.json();
      setBookmarks(bookmarks.map(b => b.id === id ? updated : b));
    } catch (error) {
      console.error('Failed to archive bookmark', error);
    }
  };

  const handlePinBookmark = async (id: number) => {
    const bookmark = bookmarks.find(b => b.id === id);
    if (!bookmark) return;

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, pinned: !bookmark.pinned }),
      });
      const updated = await res.json();
      setBookmarks(bookmarks.map(b => b.id === id ? updated : b));
    } catch (error) {
      console.error('Failed to pin bookmark', error);
    }
  };

  const handleVisitBookmark = async (id: number) => {
    const bookmark = bookmarks.find(b => b.id === id);
    if (!bookmark) return;

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          viewCount: bookmark.viewCount + 1,
          lastVisited: new Date().toISOString(),
        }),
      });
      const updated = await res.json();
      setBookmarks(bookmarks.map(b => b.id === id ? updated : b));
    } catch (error) {
      console.error('Failed to update visit bookmark', error);
    }
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

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Top Bar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button
                onClick={() => setShowSidebarMobile(!showSidebarMobile)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                ☰
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              + Add Bookmark
            </button>
          </div>

          {/* Search */}
          <div className="px-4 lg:px-8 py-3 flex gap-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <SortDropdown value={sortOption} onChange={setSortOption} />
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            {filteredBookmarks.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p>No bookmarks found</p>
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

      {/* Modal */}
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