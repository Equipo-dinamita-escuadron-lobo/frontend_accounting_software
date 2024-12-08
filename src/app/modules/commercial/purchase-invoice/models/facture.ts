import { ProductS } from "./productSend";

/**
 * Interface para la Factura de compra
 */
export interface Facture{
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
     * Factura code
     * @example 'F001'
     */
    factCode: number;
    /**
     * Factura date
     * @example '2021-01-01'
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
     * Observaciones de la factura
     * @example 'Observaciones de la factura'
     */
    factObservations: string;
}