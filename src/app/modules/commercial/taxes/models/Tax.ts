export interface Tax {
    id: number;
    code: string;
    description: string;
    interest: number;
    depositAccountId: number; 
    refundAccountId: number; 
}

export interface TaxList {
    id: number;
    code: string;
    description: string;
    interest: number;
    depositAccountName: string;
    refundAccountName: string;
}
