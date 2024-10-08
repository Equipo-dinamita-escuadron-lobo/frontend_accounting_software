export interface ProductI {
    id :string;
    itemType: string;
    code: string;
    description: string;
    minQuantity: number;
    maxQuantity: number;
    taxPercentage: number;
    creationDate: Date;
    unitOfMeasureId: number;
    supplierId:  number;
    categoryId: number;
    enterpriseId: string;
    price: number;
    state: string;
    amount: number;
    IVA: number;
    totalValue: number;
  }