import { Login } from "../../../principal/login/models/Login";
import { ProductS } from "./productSend";

/**
 * Interface para la Factura de venta
 */
export interface FactureV{
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
     * Tipo de factura
     * @example 'venta'
     */
    factureType: string;
    /**
     * Descuentos
     * @example 0
     */
    descounts: number;
    /**
     * Factura code
     * @example 'F001'
     */
    factCode: number;
    /**
     * Observaciones de la factura
     * @example 'Observaciones de la factura'
     */
    factObservations: string;
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
}