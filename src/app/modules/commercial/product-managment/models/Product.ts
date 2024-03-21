export interface Product {
    id :string;
    itemType: string;
    code: string;
    description: string;
    minQuantity: number;
    maxQuantity: number;
    taxPercentage: number;
    creationDate: Date;
    unitOfMeasure: string;
    supplier: string;
    category: string;
    price: number;
  }
  