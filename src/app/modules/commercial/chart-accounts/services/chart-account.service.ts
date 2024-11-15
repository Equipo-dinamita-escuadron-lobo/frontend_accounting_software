import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/ChartAccount';
import { ClasificationType } from '../models/ClasificationType';
import { FinancialStateType } from '../models/FinancialStateType';
import { NatureType } from '../models/NatureType';

// Set API URL based on environment configuration
let API_URL = '';

// If the microservice is for account catalogue, set the API URL to local URL
if(environment.microservice == 'enterprise'){
    API_URL = environment.API_ACCOUNT_CATALOGE_URL;
}
else{
    API_URL = environment.API_URL;
}

@Injectable({
  providedIn: 'root'
})
export class ChartAccountService {

    // URL for the account catalogue API
    //Production
    private apiURL = API_URL + 'accountCatalogue/'
    //Local
    //private apiURL = myAppUrl + 'accountCatalogue'

    constructor(private http:HttpClient) {}

    // Predefined list of nature types
    listNature: NatureType[] = [
        {id: 1, name: 'Débito'},
        {id: 2, name: 'Crédito'}
    ];

    // Predefined list of financial state types
    listFinancialState: FinancialStateType[] = [
        {id: 1, name: 'Estado de Resultados'},
        {id: 2, name: 'Estado de Situacion Financiero'}
    ];

    // Predefined list of classification types
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

    /**
     * Get a list of accounts for a given entity ID.
     * @param entId The entity ID.
     * @returns An observable of account array.
     */
    getListAccounts(entId: string): Observable<Account[]> {
        return this.http.get<Account[]>(this.apiURL + 'trees/'+entId);
    }

    /**
     * Delete an account by its code.
     * @param code The account code.
     * @returns An observable of the deleted account.
     */
    deleteAccount(code: string): Observable<Account>{
        return this.http.delete<Account>(this.apiURL + code);
    }

    /**
     * Create a new account.
     * @param account The account to create.
     * @returns An observable of the created account.
     */
    createAccount(account: Account): Observable<Account>{
        return this.http.post<Account>(this.apiURL, account);
    }

    /**
     * Update an existing account.
     * @param id The account ID.
     * @param account The updated account information.
     * @returns An observable of the updated account.
     */
    updateAccount(id?: number, account?: Account): Observable<Account> {
        return this.http.put<Account>(`${this.apiURL}${id}`,account);
    }

    /**
     * Get an account by its code and entity ID.
     * @param code The account code.
     * @param entId The entity ID.
     * @returns An observable of the account.
     */
    getAccountByCode(code: string | number, entId: string): Observable<Account>{
        return this.http.get<Account>(this.apiURL+'accountByCode/'+code+'/'+entId);
    }

    /**
     * Get the list of classification types.
     * @returns An array of classification types.
     */
    getClasificationType(): ClasificationType[] {
        return this.listClasification;
    }

    /**
     * Get the list of nature types.
     * @returns An array of nature types.
     */
    getNatureType(): NatureType[] {
        return this.listNature;
    }

    /**
     * Get the list of financial state types.
     * @returns An array of financial state types.
     */
    getFinancialStateType(): FinancialStateType[] {
        return this.listFinancialState;
    }
}
