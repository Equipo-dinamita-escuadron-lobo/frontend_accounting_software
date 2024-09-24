
export interface Product {
    id :string;
    itemType: string;
    code: string;
    description: string;
    minQuantity: number;
    maxQuantity: number;
    taxPercentage: number;
    creationDate: Date;
    unitOfMeasureId: number;
   // supplierId:  number;
    categoryId: number;
    enterpriseId: string;
    price: number;
    state: string;
  }
  
  export interface ProductList {
    id :string;
    itemType: string;
    code: string;
    description: string;
    minQuantity: number;
    maxQuantity: number;
    taxPercentage: number;
    creationDate: Date;

    unitOfMeasureName: string;
    //supplierName:  string;
    categoryName: string;

    enterpriseId: string;

    price: number;
    state: string;
  }