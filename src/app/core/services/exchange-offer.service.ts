import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ExchangeOfferResponse } from '../../shared/model/exchange-offer/exchange-offer.model';

@Injectable({
  providedIn: 'root'
})
export class ExchangeOfferService {

  private http = inject(HttpClient);
  private baseURL = `${environment.baseURL}/intercambios`; // Ajusta según tu backend

  constructor() {}

  // Obtener todas las ofertas enviadas por un usuario
  getOffersByUser(userId: number): Observable<ExchangeOfferResponse[]> {
    return this.http.get<ExchangeOfferResponse[]>(`${this.baseURL}/usuario/${userId}`);
  }

  // (Opcional para futuro)
  acceptOffer(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseURL}/${id}/aceptar`, {});
  }

  rejectOffer(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseURL}/${id}/rechazar`, {});
  }
}