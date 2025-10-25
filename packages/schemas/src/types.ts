export type PaginatedDefaultResult<T> = {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  results: T[];
};

export interface IFilter {
  [key: string]: any;
}

export interface IQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  q?: { term?: string; fields?: string | string[] };
  populate?: string[];
}

export type FilterAndOptions = {
  filter?: IFilter;
  options?: IQueryOptions;
};
