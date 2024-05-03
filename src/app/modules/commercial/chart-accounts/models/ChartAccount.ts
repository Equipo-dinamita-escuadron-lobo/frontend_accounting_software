export interface Account {
  code: string;
  description: string;
  nature: string;
  financialStatus: string;
  clasification: string;
  children?: Account[];
  showSubAccounts?: boolean;
  parent?: Account; // Nueva propiedad para mantener una referencia al padre
}
