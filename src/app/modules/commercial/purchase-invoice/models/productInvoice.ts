import { ProductType } from "./ProductType";
/**
 * Modelo de producto
 */
export interface ProductI {
  /**
   * Producto id
   * @example '1'
   */
    id :string;
    /**
     * Producto tipo
     * @example 'Citrico'
     */
    itemType: string;
    /**
     * Producto código
     * @example 'P001'
    */
    code: string;
    /**
     * Producto descripción
     * @example 'Producto 1 descripción'
     */
    description: string;
    /**
     * Producto cantidad
     * @example 10
     */
    minQuantity: number;
    /**
     * Producto cantidad máxima
     * @example 100
     */
    maxQuantity: number;
    /**
     * Producto porcentaje de impuesto
     * @example 10
     */
    taxPercentage: number;
    /**
     * Producto fecha de creación
     * @example '2021-01-01'
     */
    creationDate: Date;
    /**
     * Producto id de unidad de medida
     * @example 1
     */
    unitOfMeasureId: number;
    /**
     * Nombre de la unidad de medida
     * @example 'Kilogramo'
     */
    unitOfMeasure: string;
    /**
     * Producto id de proveedor
     * @example 1
     */
    supplierId:  number;
    /**
     * Producto id de categoría
     * @example 1
     */
    categoryId: number;
    /**
     * Producto id de empresa
     * @example '1'
     */
    enterpriseId: string;
    /**
     * Producto precio
     * @example 100
     */
    price: number;
    /**
     * Precio convertido a string para mostrar
     * @example '1.500'
     */
    displayPrice: string;
    /**
     * Producto estado
     * @example 'activo'
     */
    state: string;
    /**
     * Producto cantidad en stock
     * @example 100
     */
    amount: number;
    /**
     * Producto valor en stock
     * @example 100
     */
    IVA: number;
    /**
     * Producto valor total
     * @example 100
     */
    IvaValor: number;
    /**
     * Producto valor total
     * @example 100
     */
    totalValue: number;
    //porcentaje, valor
    /**
     * Producto descuentos
     * @example [10, 100]
     */
    descuentos: [number, number];
    /**
     * Producto descuentos convertidos a string para mostrar
     * @example '10%'
     */
    displayDescuentos: string;
    /**
     * Costo del producto
     * @example 100
     */
    cost: number;
    /**
     * Referencia del producto
     * @example 'Referencia 1'
     */
    reference: string;
    /**
     * Tipo de producto
     * @example 'Frutas'
     */
    productType: ProductType;
  }
