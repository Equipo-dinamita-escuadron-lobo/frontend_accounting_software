export interface Account {
    code: string;
    name: string;
    subAccounts?: Account[];
    showSubAccounts?: boolean;
    parent?: Account; // Nueva propiedad para mantener una referencia al padre
  }
