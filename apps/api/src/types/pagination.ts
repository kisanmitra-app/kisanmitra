export interface IFilterAndOptions {
  filter?: { [key: string]: any };
  options?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: "asc" | "desc";
    q?: { term?: string; fields?: string | string[] };
  };
}
