import { ProductType } from "./ProductType";
export interface ProductI {
  id :string;
  code: string;
  itemType: string;
  description: string;
  quantity: number;
  taxPercentage: number;
  creationDate: Date;
  unitOfMeasureId: number;
  categoryId: number;
  enterpriseId: string;
  cost: number;
  reference: string;
  productType: ProductType;
  state: string;
  amount: number;
  IVA: number;
  totalValue: number;
}