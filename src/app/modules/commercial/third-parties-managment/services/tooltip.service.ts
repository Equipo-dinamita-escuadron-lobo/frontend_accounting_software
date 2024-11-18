import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Tooltip } from '../models/Tooltip';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {

  //private tooltipApiUrl = `${environment.API_URL}/tooltips/`;
  private tooltipApiUrl = environment.API_URL + 'thirds/tooltip/'
  //Cambiar para desarrollo local
  //private tooltipApiUrl = 'http://localhost:8081/api/thirds/tooltip'

  // Inject HttpClient to make HTTP requests
  constructor(private http: HttpClient) { }

  // Get all tooltips
  getAllTooltips(): Observable<Tooltip[]> {
    return this.http.get<Tooltip[]>(this.tooltipApiUrl);
  }

  // Get a single tooltip by ID
  getTooltipById(id: string): Observable<Tooltip> {
    return this.http.get<Tooltip>(`${this.tooltipApiUrl}/${id}`);
  }

  // Create a new tooltip
  createTooltip(tooltip: Tooltip): Observable<Tooltip> {
    return this.http.post<Tooltip>(this.tooltipApiUrl, tooltip);
  }

  createTooltip2(tooltip:Tooltip): Observable<Tooltip>{
    console.log('Request Body:', tooltip); 
    return this.http.post<Tooltip>(this.tooltipApiUrl,tooltip) .pipe(
      catchError((error) => {
        console.error('Error occurred: ', error); // Log the error to the console
        return throwError(() => new Error('Error occurred while adding a hero')); // Rethrow the error as a new Observable error
      })
    );
  }

  // Update a tooltip by ID
  updateTooltip(id: string, tooltip: Tooltip): Observable<Tooltip> {
    return this.http.put<Tooltip>(`${this.tooltipApiUrl}/${id}`, tooltip);
  }

  // Delete a tooltip by ID
  deleteTooltip(id: string): Observable<void> {
    return this.http.delete<void>(`${this.tooltipApiUrl}${id}`);
  }
}
