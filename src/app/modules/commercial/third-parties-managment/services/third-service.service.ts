import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Third } from '../models/Third';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThirdServiceService {

  private thirdApiUrl = environment.API_URL + 'thirds/'
  //private thirdApiUrl = 'http://localhost:8080/api/thirds/'

  constructor(private http: HttpClient){
  }

  //Crear Un Tercero
  createThird(Third:Third): Observable<Third>{
    return this.http.post<Third>(this.thirdApiUrl,Third) .pipe(
      catchError((error) => {
        console.error('Error occurred: ', error); // Log the error to the console
        return throwError(() => new Error('Error occurred while adding a hero')); // Rethrow the error as a new Observable error
      })
    );
  }

  getThirdParties(entId: String, numPage: number): Observable<Third[]> {
    let params = new HttpParams()
    .set('entId', entId.toString())
    .set('numPage', numPage);

    return this.http.get<any>(this.thirdApiUrl, {params})
    .pipe(
      map(response => response.content as Third[])
    );
  }

  getThirdPartie(thId:number): Observable<Third>{
    return this.http.get<any>(this.thirdApiUrl+`third?thId=${thId}`)
  }

  changeThirdPartieState(thId:number): Observable<Boolean>{
    let params = new HttpParams()
    .set('thId', thId);

    const response = this.http.put<any>(this.thirdApiUrl,null,{params})

    return response;
  }
}
