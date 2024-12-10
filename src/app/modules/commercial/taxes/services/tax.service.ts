import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Tax } from '../models/Tax';



// Set API URL based on environment configuration
let API_URL = '';

// If the microservice is for account catalogue, set the API URL to local URL
if (environment.microservice == 'accountCatalogue') {
  API_URL = environment.API_LOCAL_URL;
}
else {
  API_URL = environment.API_URL;
}



@Injectable({
  providedIn: 'root'
})
export class TaxService {


  // URL for the account catalogue API
  //Production
  private apiURL = API_URL + 'tax/'
  //Local
  //private apiURL = myAppUrl + 'accountCatalogue'



  constructor(private http: HttpClient) { }

  /**
 * Obtiene la lista de impuestos asociados a una empresa específica a través de una solicitud HTTP GET.
 *
 * @param enterpriseId - El ID de la empresa para la que se desean obtener los impuestos.
 * @returns Un observable que emite la lista de impuestos de tipo `Tax[]`.
 */
  getTaxes(enterpriseId: string): Observable<Tax[]> {
    const url = this.apiURL + 'taxes/' + enterpriseId;
    return this.http.get<Tax[]>(url);
  }

  /**
 * Crea un nuevo impuesto enviando los datos del impuesto a través de una solicitud HTTP POST.
 *
 * @param tax - El objeto `Tax` que contiene la información del impuesto a crear.
 * @returns Un observable que emite el impuesto creado de tipo `Tax`.
 */
  createTax(tax: Tax): Observable<Tax> {
    const url = this.apiURL;
    return this.http.post<Tax>(url, tax);
  }

  /**
 * Actualiza un impuesto existente enviando los datos modificados a través de una solicitud HTTP PUT.
 *
 * @param tax - El objeto `Tax` con los datos actualizados del impuesto.
 * @returns Un observable que emite el impuesto actualizado de tipo `Tax`.
 */
  updateTax(tax: Tax): Observable<Tax> {
    const id = tax.id;
    const url = this.apiURL + id;
    return this.http.put<Tax>(url, tax);
  }

  /**
 * Obtiene un impuesto específico utilizando su código y el ID de la empresa asociada mediante una solicitud HTTP GET.
 *
 * @param code - El código del impuesto que se desea obtener.
 * @param enterpriseId - El ID de la empresa a la que pertenece el impuesto.
 * @returns Un observable que emite el impuesto correspondiente de tipo `Tax`.
 */
  getTaxById(code: string, enterpriseId: string): Observable<Tax> {
    const url = this.apiURL + code + '/' + enterpriseId;
    return this.http.get<Tax>(url);
  }

  /**
 * Elimina un impuesto existente a través de una solicitud HTTP DELETE utilizando el ID del impuesto.
 *
 * @param id - El ID del impuesto que se desea eliminar.
 * @returns Un observable que emite el impuesto eliminado de tipo `Tax`.
 */
  deleteTax(id: number): Observable<Tax> {
    const url = this.apiURL + id;
    return this.http.delete<Tax>(url);
  }


}


