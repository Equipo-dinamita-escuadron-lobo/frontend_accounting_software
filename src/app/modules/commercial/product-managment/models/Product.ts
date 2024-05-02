import { Third } from "../../third-parties-managment/models/third-model";
import { Category } from "./Category";
import { UnitOfMeasure } from "./UnitOfMeasure";

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
    supplierId:  number;
    categoryId: number;
    enterpriseId: string;
    price: number;
    state: string;
  }
  