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
  private baseURL = `${environment.baseURL}/user/auth/exchanges`; 

  constructor() {}

  // Obtener todas las ofertas enviadas por un usuario
  getOffersByUser(userId: number): Observable<ExchangeOfferResponse[]> {
    return this.http.get<ExchangeOfferResponse[]>(`${this.baseURL}/user/${userId}`);
  }
}