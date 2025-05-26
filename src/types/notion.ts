export interface NotionPage {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  published: boolean;
  readingTime?: number;
}

export interface NotionDatabase {
  id: string;
  title: string;
  description?: string;
  pages: NotionPage[];
}

export interface NotionProperty {
  id: string;
  name: string;
  type: string;
  value: any;
}

export interface CachedPage {
  page: NotionPage;
  cachedAt: string;
  lastModified: string;
}

export interface BlogPost extends NotionPage {
  author?: string;
  category?: string;
  featured?: boolean;
}
