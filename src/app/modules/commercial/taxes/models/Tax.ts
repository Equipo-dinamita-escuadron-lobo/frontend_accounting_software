export interface Tax {
    id:number 
    code: string;
    description: string;
    interest: number;
    refundAccount: string; //Id cuenta devolucion
    depositAccount: string; //Id cuenta deposito
    idEnterprise: string;
}

export interface TaxList {
    id: number;
    code: string;
    description: string;
    interest: number;
    depositAccountName: string;
    refundAccountName: string;
    idEnterprise: string;
}
