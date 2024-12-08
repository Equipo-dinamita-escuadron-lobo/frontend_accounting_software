import { ProductS } from "./productSend";

/**
 * Interface para preview de la Factura de compra
 */
export interface PreviewFacture{
    /**
     * Empresa id
     * @example '1'
     */
    entId?: string;
    /**
     * Tercero id
     * @example '1'
     */
    thId?: number;
    /**
     * Proveedor de los productos
     * @example 'Proveedor 1'
     */
    supplier: string;
    /**
     * Factura code
     * @example 'F001'
     */
    factCode: number;
    /**
     * Factura date
     * @example 'compra'
     */
    factureType: string;
    /**
     * Lista de productos de la factura
     * @example [ProductS]
     */
    factProducts: ProductS[];
    /**
     * Factura subtotal
     * @example 100
     */
    factSubtotals: number;
    /**
     * Factura total
     * @example 100
     */
    facSalesTax: number;
    /**
     * Factura total con impuestos
     * @example 100
     */
    facWithholdingSource: number;
    /**
     * Factura total
     * @example 100
     */
    total: number;
    /**
     * Observaciones de la factura
     * @example 'Observaciones de la factura
     */
    factObservations: string;
}