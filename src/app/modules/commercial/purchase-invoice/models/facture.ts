import { ProductS } from "./productSend";

export interface Facture{
    factId: number;
    entId?: string;
    thId?: number;
    factCode: string;
    factureType: string;
    factProducts: ProductS[];
    factSubTotals: number;
    facSalesTax: number;
    facWithholdingSource: number;
}