export interface Account {
  code: string;
  name: string;
  nature: string;
  financialState: string;
  clasification: string;
  subAccounts?: Account[];
  showSubAccounts?: boolean;
  parent?: Account; // Nueva propiedad para mantener una referencia al padre
}