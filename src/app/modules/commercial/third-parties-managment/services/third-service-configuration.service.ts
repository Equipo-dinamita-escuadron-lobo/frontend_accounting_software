import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { ThirdType } from '../models/ThirdType';
import { TypeId } from '../models/TypeId';

@Injectable({
  providedIn: 'root'
})
export class ThirdServiceConfigurationService {

  private thirdApiUrl = environment.API_URL + 'thirds/configuration/'
  //private thirdApiUrl = 'http://localhost:8080/api/thirds/configuration/'

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

}
