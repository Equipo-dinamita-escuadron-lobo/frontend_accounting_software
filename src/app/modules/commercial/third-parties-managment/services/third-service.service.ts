import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Third } from '../models/Third';

@Injectable({
  providedIn: 'root'
})
export class ThirdServiceService {

  private thirdApiUrl = "http://localhost:8080/api/thirds/"

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
    
    const data = {
      entId: entId,
      numPage: numPage
    };

    return this.http.post<any>(this.thirdApiUrl + 'listThird', data)
    .pipe(
      map(response => response.content as Third[])
    );
  }

}
