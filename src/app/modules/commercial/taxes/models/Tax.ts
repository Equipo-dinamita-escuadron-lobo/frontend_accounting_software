export interface Tax {
    id:number 
    code: string;
    description: string;
    interest: number;
    depositAccountId: number; 
    refundAccountId: number; 
    enterpriseId: string;
}

export interface TaxList {
    id: number;
    code: string;
    description: string;
    interest: number;
    depositAccountName: string;
    refundAccountName: string;
    enterpriseId: string;
}
