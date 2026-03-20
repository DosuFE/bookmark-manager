export interface Bookmark {
  id: number;
  title: string;
  description: string;
  url: string;
  tags: string[];
  favicon: string;
  viewCount: number;
  lastVisited: string;
  dateAdded: string;
  archived: boolean;
  pinned: boolean;
}

export type SortOption = 'recently-added' | 'recently-visited' | 'most-visited';
