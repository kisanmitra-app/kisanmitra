export interface ICreateInventoryInput {
  productId: string;
  quantity: number;
  batchNumber?: string;
  expiryDate?: string;
  location?: string;
  notes?: string;
}

export interface IUpdateInventoryInput {
  quantity?: number;
  batchNumber?: string;
  expiryDate?: string;
  location?: string;
  notes?: string;
}
