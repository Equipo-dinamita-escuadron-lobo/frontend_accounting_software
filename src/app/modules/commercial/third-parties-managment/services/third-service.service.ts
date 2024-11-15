import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Third } from '../models/Third';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThirdServiceService {
  private infoThirdRUT: string |null=null;

  setInfoThirdRUT(info: string): void {
    this.infoThirdRUT = info;
  }

  getInfoThirdRUT(): string | null {
    return this.infoThirdRUT;
  }

  clearInfoThirdRUT(): void {
    this.infoThirdRUT = null;
  }

  //private thirdApiUrl = environment.API_URL + 'thirds/'
  //Cambiar para desarrollo local
  private thirdApiUrl = 'http://localhost:8081/api/thirds/'

  constructor(private http: HttpClient){
  }

  //Crear Un Tercero
  createThird(Third:Third): Observable<Third>{
    console.log('Request Body:', Third); 
    return this.http.post<Third>(this.thirdApiUrl,Third) .pipe(
      catchError((error) => {
        console.error('Error occurred: ', error); // Log the error to the console
        return throwError(() => new Error('Error occurred while adding a hero')); // Rethrow the error as a new Observable error
      })
    );
  }

  //Extraer informacion del PDF del RUT para crear un tercero
  ExtractInfoPDFRUT (file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    console.log('Request Body:', formData);

    return this.http.post<any>(this.thirdApiUrl+"content-PDF-RUT", formData).pipe(
      catchError((error) => {
        console.error('Error occurred: ', error);
        return throwError(() => new Error('Error occurred while uploading the file'));
      })
    );
  }

  UpdateThird(Third:object): Observable<Third>{
    console.log('Request Body:', Third); 
    return this.http.post<Third>(this.thirdApiUrl+"update",Third) .pipe(
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

  getThirdList(entId: String): Observable<Third[]> {
    let params = new HttpParams()
    .set('entId', entId.toString());
    return this.http.get<any>(this.thirdApiUrl+"list", {params})
  }

  getThirdPartie(thId:number): Observable<Third>{
    return this.http.get<any>(this.thirdApiUrl+`third?thId=${thId}`)
  }
  existThird(thId:number, entId:String): Observable<boolean>{
    return this.http.get<boolean>(`${this.thirdApiUrl}existBy?idNumber=${thId}&entId=${entId}`);
  }

  changeThirdPartieState(thId:number): Observable<Boolean>{
    let params = new HttpParams()
    .set('thId', thId);

    const response = this.http.put<any>(this.thirdApiUrl,null,{params})

    return response;
  }
}
