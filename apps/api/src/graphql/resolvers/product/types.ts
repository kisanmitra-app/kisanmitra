export interface ICreateProductInput {
  name: string;
  description?: string;
  category: string;
  brand?: string;
  unit?: string;
}

export interface IUpdateProductInput {
  name?: string;
  description?: string;
  category?: string;
  brand?: string;
  unit?: string;
}
