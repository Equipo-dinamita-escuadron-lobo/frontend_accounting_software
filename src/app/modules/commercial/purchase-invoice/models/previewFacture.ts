import { ProductS } from "./productSend";

export interface PreviewFacture{
    entId?: string;
    thId?: number;
    supplier: string;
    factCode: number;
    factureType: string;
    factProducts: ProductS[];
    factSubtotals: number;
    facSalesTax: number;
    facWithholdingSource: number;
    total: number;
    factObservations: string;
}