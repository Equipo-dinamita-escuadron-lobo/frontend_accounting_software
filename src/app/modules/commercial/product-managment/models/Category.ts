/**
 * Category model
 */
export interface Category {
    /**
     * Category id
     * @example 1
     */
    id: number; 
    /**
     * Category name
     * @example 'Category 1'
     */
    name: string; 
    /**
     * Category description
     * @example 'Category 1 description'
     */
    description: string;
    /**
     * Enterprise id
     * @example '1'
     */
    enterpriseId:string;
    /**
     * Category state
     * @example 'active'
     */
    state:string;
    /**
     * Inventory id
     * @example 1
     */
    inventoryId:number;
    /**
     * Cost id
     * @example 1
     */
    costId:number;
    /**
     * Sale id
     * @example 1
     */
    saleId:number; 
    /**
     * Return id
     * @example 1
     */ 
    returnId:number;
    /**
     * Tax id
     * @example 1
     */
    taxId: number;
}
/**
 * Category list model
 */
export interface CategoryList {
    /**
     * Category id
     */
    id: number; 
    /**
     * Category name
     */
    name: string;
    /**
     * Category description
     */ 
    description: string;
    /**
     * Enterprise id
     */
    enterpriseId:string;
    /**
     * Category state
     */
    state:string;
    /**
     * Inventory name
     */
    inventoryName:string; 
    /**
     * Cost name
     */
    costName:string;
    /**
     * Sale name
     */
    saleName:string;
    /**
     * Return name
     */
    returnName:string;
    /**
     * Tax name
     */
    taxId: number;
}