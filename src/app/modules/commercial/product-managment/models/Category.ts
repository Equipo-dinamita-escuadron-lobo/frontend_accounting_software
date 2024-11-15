export interface Category {
    id: number; 
    name: string; 
    description: string;
    enterpriseId:string;
    state:string;
    inventoryId:number;
    costId:number;
    saleId:number;  
    returnId:number;
    taxId: number;
}
export interface CategoryList {
    id: number; 
    name: string; 
    description: string;
    enterpriseId:string;
    state:string;
    inventoryName:string; 
    costName:string;
    saleName:string;
    returnName:string;
    taxId: number;
}