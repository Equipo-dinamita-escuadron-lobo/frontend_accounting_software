export interface Account {
  code: string;
  description: string;
  nature: string;
  financialStatus: string;
  classification: string;
  children?: Account[];
  showSubAccounts?: boolean;
  parent?: Account; // Nueva propiedad para mantener una referencia al padre
}
