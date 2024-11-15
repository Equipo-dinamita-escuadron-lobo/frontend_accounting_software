import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { ThirdType } from '../models/ThirdType';
import { TypeId } from '../models/TypeId';

@Injectable({
  providedIn: 'root'
})
export class ThirdServiceConfigurationService {
  //private thirdApiUrl = environment.API_URL + 'thirds/configuration/'
  //cambiar para desarrollo local
  private thirdApiUrl = 'http://localhost:8081/api/thirds/configuration/'

  constructor(private http: HttpClient){
  }

  getThirdTypes(entId: String): Observable<ThirdType[]> {
    let params = new HttpParams()
    .set('entId', entId.toString());

    return this.http.get<ThirdType[]>(this.thirdApiUrl+"thirdtype", {params});
  }

  getTypeIds(entId: String): Observable<TypeId[]> {
    let params = new HttpParams()
    .set('entId', entId.toString());

    return this.http.get<TypeId[]>(this.thirdApiUrl+"typeid", {params});
  }

  createTypeId(TypeId:TypeId): Observable<TypeId>{
    return this.http.post<TypeId>(this.thirdApiUrl+"typeid",TypeId) .pipe(
      catchError((error) => {
        console.error('Error occurred: ', error); // Log the error to the console
        return throwError(() => new Error('Error occurred while adding a hero')); // Rethrow the error as a new Observable error
      })
    );
  }

  createThirdType(ThirdType:ThirdType): Observable<ThirdType>{
    return this.http.post<ThirdType>(this.thirdApiUrl+"thirdtype",ThirdType) .pipe(
      catchError((error) => {
        console.error('Error occurred: ', error); // Log the error to the console
        return throwError(() => new Error('Error occurred while adding a hero')); // Rethrow the error as a new Observable error
      })
    );
  }
  deleteThird(entId: string): Observable<void> {
    return this.http.delete<void>(`${this.thirdApiUrl}${entId}`).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('Error occurred: ', error); // Log the error to the console

            // Aquí puedes transformar el error para incluir el mensaje que deseas
            const errorMessage = error.error && error.error.text ? error.error.text : 'Error occurred while deleting the third type';
            return throwError(() => new HttpErrorResponse({
                error: { text: errorMessage }, // Mantiene la estructura esperada
                status: error.status,
                statusText: error.statusText,
                
            }));
        })
    );
}
 deleteId(entId: string): Observable<void> {
    return this.http.delete<void>(`${this.thirdApiUrl}${entId}`).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('Error occurred: ', error); // Log the error to the console

            // Aquí puedes transformar el error para incluir el mensaje que deseas
            const errorMessage = error.error && error.error.text ? error.error.text : 'Error occurred while deleting the third type';
            return throwError(() => new HttpErrorResponse({
                error: { text: errorMessage }, // Mantiene la estructura esperada
                status: error.status,
                statusText: error.statusText,
                
            }));
        })
    );
}

}
