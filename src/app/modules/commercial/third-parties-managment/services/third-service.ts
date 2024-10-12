import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Third } from '../models/third-model'; // Importa el modelo que creaste

@Injectable({
  providedIn: 'root'
})
export class ThirdService {
  // private apiUrl = 'http://tuapi.com/api/terceros'; // Reemplaza con la URL de tu API real
  private apiUrl = 'assets/data/thirds-parties/thirds-parties.json';
  constructor(private http: HttpClient) {}

  getThirdParties(): Observable<Third[]> {
    return this.http.get<Third[]>(this.apiUrl);
  }

  // Aquí podrías añadir más métodos para manejar terceros, como agregar, editar, eliminar, etc.
}
