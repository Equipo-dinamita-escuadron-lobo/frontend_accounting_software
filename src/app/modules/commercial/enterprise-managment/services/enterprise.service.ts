import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Enterprise, EnterpriseDetails } from '../models/Enterprise';
import { EnterpriseList } from '../models/EnterpriseList';
import { EnterpriseType } from '../models/EnterpriseType';
import { environment } from '../../../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { LocalStorageMethods } from '../../../../shared/methods/local-storage.method';
//import { environment } from '../../../../../environments/enviorment.development';

let API_URL = '';

//Si microservice es de enterprise se cambia la url de la api a local
if(environment.microservice == 'enterprise'){
    API_URL = environment.API_LOCAL_URL;
}
else{
    API_URL = environment.API_URL;
}

@Injectable({
  providedIn: 'root',
})
export class EnterpriseService {
  logoDefault: string =
    '../../../../../../assets/Iconos/enterprise/icon-default.png';
  /**
   * Test of service
   */
  private infoEnterpriseRUT: string |null=null;
  setInfoEnterpiseRUT(info: string): void {
    this.infoEnterpriseRUT = info;
  }
  getinfoEnterpriseRUT(): string | null {
    return this.infoEnterpriseRUT;
  }
  clearInfoEnterpriseRUT(): void {
    this.infoEnterpriseRUT = null;
  }
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  enterpriseSelected?: EnterpriseDetails;

  enterpriseTypes: EnterpriseType[] = [
    { id: 1, name: 'Privada' },
    { id: 2, name: 'Oficial' },
    { id: 3, name: 'Mixta' },
  ];

  //Route API
  private apiUrl = API_URL + 'enterprises/';

  //Route cloudinary
  private urlCloudinary = environment.myStorageUrl;

  constructor(private http: HttpClient) {}

  /**
   * @description Method to get all enterprises.
   * @returns all tax payer types from the backend
   */

  getEnterprisesActive(): Observable<EnterpriseList[]> {
    return this.http.get<EnterpriseList[]>(this.apiUrl);
  }

  getEnterprisesInactive(): Observable<EnterpriseList[]> {
    return this.http.get<EnterpriseList[]>(this.apiUrl + 'inactive');
  }

  /**
   *
   * @param id enterprise´s identifier
   * @description  Method to get one enterprise by its ID.
   * @returns one enterprise with id
   */
  getEnterpriseById(id: string): Observable<EnterpriseDetails> {
    const url = `${this.apiUrl}enterprise/${id}`;
    return this.http.get<EnterpriseDetails>(url);
  }

  /**
   * @param enterprise
   * @returns respond from the backend of creation enterprise
   */
  createEnterprise(enterprise: Enterprise): Observable<Enterprise> {
    return this.http.post<Enterprise>(this.apiUrl, enterprise);
  }

  updateStatusEnterprise(id: string, status: string) {
    const url = `${this.apiUrl}update/status/${id}/${status}`;
    return this.http.put(url, null);
  }

  updateEnterprise(id?: string, enterprise?: Enterprise) {
    const url = `${this.apiUrl}update/${id}`;
    return this.http.put(url, enterprise);
  }

  getTypesEnterprise() {
    return this.enterpriseTypes;
  }

  uploadImg(data: any): Observable<any> {
    return this.http.post(this.urlCloudinary, data);
  }

  downloadLogo(url: string): Observable<File> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map(blob => {
        const tipoMIME = blob.type;
        const extension = tipoMIME.split('/')[1];
        const nombreArchivo = `imagen.${extension}`;
        return new File([blob], nombreArchivo, {
          type: 'image/jpeg',
        });
      })
    );
  }

  getSelectedEnterprise() {
    return this.localStorageMethods.loadEnterpriseData();
  }

  getEnterpriseSelectedInfo() {
    const id = this.getSelectedEnterprise();
    if (id === null) {

    } else {
      this.getEnterpriseById(id).subscribe({
        next: (enterpriseData) => {
          this.enterpriseSelected = enterpriseData;
        },
      });
    }

    return this.enterpriseSelected;
  }

  //Extraer informacion del PDF del RUT para crear un tercero
  ExtractInfoPDFRUT (file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    console.log('Request Body:', formData);
    console.log(this.apiUrl+"content-PDF-RUT");
    return this.http.post<string>(this.apiUrl+"content-PDF-RUT", formData).pipe(
      catchError((error) => {
        console.error('Pailaaaaaaaaaaaaaa ', error);
        return throwError(() => new Error('Error occurred while uploading the file'));
      })
    );
  }
}
