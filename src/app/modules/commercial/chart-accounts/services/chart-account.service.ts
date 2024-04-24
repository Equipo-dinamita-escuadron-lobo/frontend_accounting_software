import { Injectable } from '@angular/core';
//import { environment } from '../../../../../environments/environment';
import { environment } from '../../../../../environments/enviorment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/ChartAccount';

@Injectable({
  providedIn: 'root'
})
export class ChartAccountService {

  //private apiURL = environment.API_URL + 'chart-account'
  private apiURL = environment.myAppUrl + 'chart-account'
  constructor(private http:HttpClient) {
    
   }

  getListAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiURL);
  }

}
