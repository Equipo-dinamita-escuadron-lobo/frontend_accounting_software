
export interface Product {
    id :string;
    itemType: string;
    code: string;
    description: string;
    quantity: number;
    //maxQuantity: number;
    taxPercentage: number;
    creationDate: Date;
    unitOfMeasureId: number;
   // supplierId:  number;
    categoryId: number;
    enterpriseId: string;
    cost: number;
    state: string;
    reference: string;
  }
  
  export interface ProductList {
    id :string;
    itemType: string;
    code: string;
    description: string;
    quantity: number;
    //maxQuantity: number;
    taxPercentage: number;
    creationDate: Date;

    unitOfMeasureName: string;
    //supplierName:  string;
    categoryName: string;

    enterpriseId: string;

    cost: number;
    state: string;
  }