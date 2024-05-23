export interface Account {
  id?: number;
  code: string;
  description: string;
  nature: string;
  financialStatus: string;
  classification: string;
  children?: Account[];
  showSubAccounts?: boolean;
  parent?: string;
  parentAccount?: Account;
}
