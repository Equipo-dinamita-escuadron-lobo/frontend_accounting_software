export interface Account {
    code: string;
    name: string;
    subAccounts?: Account[];
    showSubAccounts?: boolean;
}
