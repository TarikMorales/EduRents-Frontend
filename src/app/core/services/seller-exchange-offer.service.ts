import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ExchangeOfferResponse } from '../../shared/model/exchange-offer/exchange-offer.model';

@Injectable({
  providedIn: 'root'
})
export class SellerExchangeOfferService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.baseURL}/seller/auth/exchanges`;

  constructor() {}

  getOffersToSeller(idVendedor: number): Observable<ExchangeOfferResponse[]> {
    return this.http.get<ExchangeOfferResponse[]>(`${this.baseUrl}/seller/${idVendedor}`);
  }

  aceptarOferta(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/aceptar`, {});
  }

  rechazarOferta(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/rechazar`, {});
  }
}