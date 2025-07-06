import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AlertDTO, ShowAlertDTO } from '../../shared/model/alerts/alert.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private baseURL = `${environment.baseURL}/user/auth/alerts`;
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

  constructor() { }

  private getAuthHeaders(): HttpHeaders {
    const authData = this.storageService.getAuthData();
    if (authData && authData.token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${authData.token}`,
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Create a new alert
  createAlert(alertDTO: AlertDTO): Observable<AlertDTO> {
    return this.http.post<AlertDTO>(this.baseURL, alertDTO, { headers: this.getAuthHeaders() });
  }

  // Delete an alert by ID
  deleteAlert(idAlert: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${idAlert}`, { headers: this.getAuthHeaders() });
  }

  // Get all alerts for a user
  getAlertsByUser(idUser: number): Observable<ShowAlertDTO[]> {
    return this.http.get<ShowAlertDTO[]>(`${this.baseURL}/user/${idUser}`, { headers: this.getAuthHeaders() });
  }

  // Mark an alert as viewed
  markAsViewed(idAlert: number): Observable<void> {
    return this.http.put<void>(`${this.baseURL}/${idAlert}/viewed`, {}, { headers: this.getAuthHeaders() });
  }
} 