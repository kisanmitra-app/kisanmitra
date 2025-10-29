export interface ICreateUsageInput {
  inventoryId: string;
  quantityUsed: number;
  usedOn: string;
  crop?: string;
  field?: string;
  purpose?: string;
  notes?: string;
}
