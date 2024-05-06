import { Enterprise } from "../../enterprise-managment/models/Enterprise";

export interface UnitOfMeasure {
    id: number; 
    name: string; 
    abbreviation: string; 
    description: string; 
    enterpriseId:string;
    state : string;
  }
  