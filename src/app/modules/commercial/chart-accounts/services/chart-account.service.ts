import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
//import { environment } from '../../../../../environments/enviorment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/ChartAccount';
import { ClasificationType } from '../models/ClasificationType';
import { FinancialStateType } from '../models/FinancialStateType';
import { NatureType } from '../models/NatureType';

@Injectable({
  providedIn: 'root'
})
export class ChartAccountService {

    //Production
    private apiURL = environment.API_URL + 'accountCatalogue/'
    //Local
    //private apiURL = environment.myAppUrl + 'accountCatalogue'

    constructor(private http:HttpClient) {}

    listNature: NatureType[] = [
        {id: 1, name: 'Débito'},
        {id: 2, name: 'Crédito'}
    ];

    listFinancialState: FinancialStateType[] = [
        {id: 1, name: 'Estado de Resultados'},
        {id: 2, name: 'Estado de Situacion Financiero'}
    ];

    listClasification: ClasificationType[] = [
        {id: 1, name: 'Activo Corriente'},
        {id: 2, name: 'Activo No Corriente'},
        {id: 3, name: 'Pasivo Corriente'},
        {id: 4, name: 'Pasivo No Corriente'},
        {id: 5, name: 'Patrimonio'},
        {id: 6, name: 'Ingresos No Operacionales'},
        {id: 7, name: 'Gastos Operacionales'},
        {id: 8, name: 'Ingresos Operacionales'}
    ];

    getListAccounts(): Observable<Account[]> {
        return this.http.get<Account[]>(this.apiURL + 'trees');
    }

    deleteAccount(code: string): Observable<Account>{
        return this.http.delete<Account>(this.apiURL + code);
    }

    createAccount(account: Account): Observable<Account>{
        return this.http.post<Account>(this.apiURL, account);
    }

    updateAccount(id?: number, account?: Account): Observable<Account> {
        return this.http.put<Account>(`${this.apiURL}${id}`,account);
    } 

    getAccountByCode(code: string): Observable<Account>{
        return this.http.get<Account>(this.apiURL+'accountByCode/'+code);
    }

    getClasificationType(): ClasificationType[] {
        return this.listClasification;
    }

    getNatureType(): NatureType[] {
        return this.listNature;
    } 

    getFinancialStateType(): FinancialStateType[] {
        return this.listFinancialState;
    }

    saveAccountsImport(accounts:Account[]): boolean{
        //this.listAccounts = accounts;
        //TODO: ver la confirmacion desde el backend de que se guardo las cuentas importadas
        return true;
    }

}
