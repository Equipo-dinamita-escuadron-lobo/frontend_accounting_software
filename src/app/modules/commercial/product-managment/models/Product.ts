/**
 * Interface for the Product
 */
export interface Product {
    /**
     * Product id
     * @example '1'
     */
    id :string;
    /**
     * Product code
     * @example 'P001'
    */
    code: string;
    /**
     * Product item type
     * @example 'Product'
     */
    itemType: string;
    /**
     * Product description
     * @example 'Product 1 description'
     */
    description: string;
    /**
     * Product quantity
     * @example 10
     */
    quantity: number;
    /**
     * Product tax percentage
     * @example 10
     */
    taxPercentage: number;
    /**
     * Product creation date
     * @example '2021-01-01'
     */
    creationDate: Date;
    /**
     * Product unit of measure id
     * @example 1
     */
    unitOfMeasureId: number;
    /**
     * Product supplier id
     * @example 1
     */
    categoryId: number;
    /**
     * Product enterprise id
     * @example '1'
     */
    enterpriseId: string;
    /**
     * Product cost
     * @example 100
     */
    cost: number;
    /**
     * Product state
     * @example 'active'
     */
    state: string;
    /**
     * Product reference
     * @example 'P001'
     */
    reference: string;
    /**
     * Product product type id
     * @example 1
     */
    productTypeId: number;
  }
  
  export interface ProductList {
    id :string;
    code: string;
    itemType: string;
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

    reference: string;
    productTypeName: string;
  }