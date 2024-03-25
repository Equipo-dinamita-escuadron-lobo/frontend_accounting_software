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
    unitOfMeasure: UnitOfMeasure;
    supplier: string;
    category: Category;
    price: number;
  }
  