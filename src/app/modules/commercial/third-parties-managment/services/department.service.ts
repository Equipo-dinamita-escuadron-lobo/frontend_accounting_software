import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Department } from '../models/Department';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
//import { environment } from '../../../../../environments/enviorment.development'

let API_URL = '';

//Si microservice es de enterprise se cambia la url de la api a local
if(environment.microservice == 'enterprise'){
    API_URL = environment.API_LOCAL_URL;
}
else{
    API_URL = environment.API_URL;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  colombianDepartments: Department[] = [
    { id: 1, name: 'Amazonas' },
    { id: 2, name: 'Antioquia' },
    { id: 3, name: 'Arauca' },
    { id: 4, name: 'Atlántico' },
    { id: 5, name: 'Bolívar' },
    { id: 6, name: 'Boyacá' },
    { id: 7, name: 'Caldas' },
    { id: 8, name: 'Caquetá' },
    { id: 9, name: 'Casanare' },
    { id: 10, name: 'Cauca' },
    { id: 11, name: 'Cesar' },
    { id: 12, name: 'Chocó' },
    { id: 13, name: 'Córdoba' },
    { id: 14, name: 'Cundinamarca' },
    { id: 15, name: 'Guainía' },
    { id: 16, name: 'Guaviare' },
    { id: 17, name: 'Huila' },
    { id: 18, name: 'La Guajira' },
    { id: 19, name: 'Magdalena' },
    { id: 20, name: 'Meta' },
    { id: 21, name: 'Nariño' },
    { id: 22, name: 'Norte de Santander' },
    { id: 23, name: 'Putumayo' },
    { id: 24, name: 'Quindío' },
    { id: 25, name: 'Risaralda' },
    { id: 26, name: 'San Andrés y Providencia' },
    { id: 27, name: 'Santander' },
    { id: 28, name: 'Sucre' },
    { id: 29, name: 'Tolima' },
    { id: 30, name: 'Valle del Cauca' },
    { id: 31, name: 'Vaupés' },
    { id: 32, name: 'Vichada' }
  ];

  extranjeroDepartments: Department[] = [
    { id: 33, name: 'Extranjero' },
  ];

  //Production
  private apiUrl = API_URL + 'address/departments';
  //Local
  //private apiUrl = myAppUrl + 'address/departments';
  constructor(private http: HttpClient) {

   }


  getListDepartmentsBackend(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }


  getDepartmentById(id: number) {
    if (id == 2) {
      return this.extranjeroDepartments;
    }else{
      return this.colombianDepartments;
    }
  }

  getListDepartments(){
    return this.colombianDepartments;
  }
}
