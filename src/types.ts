export interface IndexEntry {
  topic: string;
  book: string;
  page: string;
}

export interface SearchResult extends IndexEntry {
  id: string;
  fullBookTitle: string;
}

export const BOOK_MAP: Record<string, string> = {
  GH: "The Green Gardening Handbook",
  BG: "The Green Budget Guide",
  SD: "Sizzle and Drizzle",
  CG: "Clean and Green",
  GL: "Green Living Made Easy",
  GK: "Nancy’s Green and Easy Kitchen",
  CM: "Clean Magic",
};
