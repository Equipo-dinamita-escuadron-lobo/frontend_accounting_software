import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enterprise, EnterpriseDetails } from '../models/Enterprise';
import { EnterpriseList } from '../models/EnterpriseList';
import { EnterpriseType } from '../models/EnterpriseType';
import { environment } from '../../../../../environments/enviorment.development';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  logoDefault:string = "../../../../../../assets/Iconos/enterprise/icon-default.png";
  /**
   * Test of service
   */

  enterpriseTypes: EnterpriseType[] = [
    { id: 1, name: 'Privada' },
    { id: 2, name: 'Oficial' },
    { id: 3, name: 'Mixta' }
];
  private selectedEnterprise:string = '-1';
  //Route API
  private apiUrl = environment.myAppUrl + 'enterprises/';  

  //Route cloudinary
  private urlCloudinary = environment.myStorageUrl;

  constructor(private http: HttpClient) { }

    /**
   * @description Method to get all enterprises.
   * @returns all tax payer types from the backend
   */
  

  
  getEnterprisesActive(): Observable<EnterpriseList[]> {
    return this.http.get<EnterpriseList[]>(this.apiUrl);
  }

  /*
  getEnterprises():EnterpriseList[]{
    return [
      {id:1, name: "Unicauca", nit: "1234", logo: this.logoDefault},
      {id:2, name: "Exito", nit: "1234", logo: this.logoDefault},
      {id:1, name: "Exito", nit: "1234", logo: this.logoDefault},
      {id:2, name: "Exito", nit: "1234", logo: this.logoDefault},
      {id:1, name: "Exito", nit: "1234", logo: this.logoDefault},
      {id:2, name: "Exito", nit: "1234", logo: this.logoDefault},
      {id:1, name: "Exito", nit: "1234", logo: this.logoDefault},
      {id:2, name: "Exito", nit: "1234", logo: this.logoDefault}
    ]
  }*/

  /**
   * 
   * @param id enterprise´s identifier
   * @description  Method to get one enterprise by its ID. 
   * @returns one enterprise with id
   */
  getEnterpriseById(id: string): Observable<EnterpriseDetails> {
    const url = `${this.apiUrl}enterprise/${id}`;
    console.log(url)
    return this.http.get<EnterpriseDetails>(url);
  }

  /**
   * @param enterprise 
   * @returns respond from the backend of creation enterprise
   */
  createEnterprise(enterprise: Enterprise): Observable<Enterprise> {
    console.log(enterprise);
    return this.http.post<Enterprise>(this.apiUrl, enterprise);
  }

  updateStatusEnterprise(id:string, status:string) {
    const url = `${this.apiUrl}update/status/${id}/${status}`;
    return this.http.put(url,null);
  }

  
  getTypesEnterprise(){
    return this.enterpriseTypes;
  }

  uploadImg(data: any): Observable<any>{
    return this.http.post(this.urlCloudinary, data);
  }

  getSelectedEnterprise(){
    return this.selectedEnterprise;
  }

  setSelectedEnterprise(value:string){
    this.selectedEnterprise = value;
  }

  restartSelectedEnterprise(){
    this.selectedEnterprise = '-1';
  }

}
