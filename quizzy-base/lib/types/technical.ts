
export type ID = string;
export type MarkdownString = string;

export type DatabaseIndexed = {
  id: ID;
  deleted?: boolean;
  lastUpdate?: number;
};

export type KeywordIndexed = {
  tags?: string[];
  categories?: string[];
  
  keywords?: string[];
  keywordsFrequency?: Record<string, number>;
  tagsFrequency?: Record<string, number>;
  keywordsUpdatedTime?: number;
};

export type SearchResult<T> = {
  query: string;
  keywords: readonly string[];
  result: readonly T[];
  totalPages: number;
};


export const sanitizeIndices = <T extends DatabaseIndexed & KeywordIndexed>(
  object: T,
  inPlace: boolean = false,
  retainTags: boolean = true,
) => {
  const ret = inPlace ? object : { ...object };
  delete ret.deleted;
  // delete ret.lastUpdate;
  delete ret.keywords;
  delete ret.keywordsFrequency;
  delete ret.tagsFrequency;
  delete ret.keywordsUpdatedTime;
  if (!retainTags) {
    delete ret.tags;
  }
  return ret;
}