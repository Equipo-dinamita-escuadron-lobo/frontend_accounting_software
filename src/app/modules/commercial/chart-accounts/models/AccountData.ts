
export interface AccountData {
  code: string;
  description: string;
  nature: string;
  financialStatus: string;
  classification: string;
  grupo?: AccountData;
  cuenta?: AccountData;
  subcuenta?: AccountData;
  auxiliar?: AccountData;
}