/**
 * Interface para los productos enviados a la factura
 */
export interface ProductS{
    /**
     * Producto id
     * @example 1
     */
    productId: number;
    /**
     * Producto nombre
     * @example 'Producto 1'
     */
    amount: number;
    /**
     * Producto cantidad
     * @example 10
     */
    description: string;
    /**
     * Producto precio unitario
     * @example 10
     */
    vat: number;
    /**
     * Producto subtotal
     * @example 100
     */
    unitPrice: number;
    /**
     * Producto subtotal
     * @example 100
     */
    subtotal: number;
}