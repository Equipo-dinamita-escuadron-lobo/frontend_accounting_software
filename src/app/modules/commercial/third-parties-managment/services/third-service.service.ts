import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Third } from '../models/Third';

@Injectable({
  providedIn: 'root'
})
export class ThirdServiceService {

  private thirdApiUrl = "http://localhost:8080/th_api/thirds"

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

  getThirdParties(): Observable<Third[]> {
    return this.http.get<any>(this.thirdApiUrl);
  }

}
