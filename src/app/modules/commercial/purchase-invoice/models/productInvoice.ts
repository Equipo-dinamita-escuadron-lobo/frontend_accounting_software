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
    unitOfMeasure: string;
    supplierId:  number;
    categoryId: number;
    enterpriseId: string;
    price: number;
    state: string;
    amount: number;
    IVA: number;
    IvaValor: number;
    totalValue: number;
    descuentos: [number, number];
  }