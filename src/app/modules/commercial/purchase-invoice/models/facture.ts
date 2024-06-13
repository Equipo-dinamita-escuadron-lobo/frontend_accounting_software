import { ProductS } from "./productSend";

export interface Facture{
    entId?: string;
    thId?: number;
    factCode: string;
    factureType: string;
    factProducts: ProductS[];
    factSubtotals: number;
    facSalesTax: number;
    facWithholdingSource: number;
}