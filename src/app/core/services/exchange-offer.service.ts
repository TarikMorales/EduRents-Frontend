import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ExchangeOfferResponse } from '../../shared/model/exchange-offer/exchange-offer.model';
import { ExchangeOfferRequest } from '../../shared/model/exchange-offer/exchange-offer-request.model';

@Injectable({
  providedIn: 'root'
})
export class ExchangeOfferService {
  private http = inject(HttpClient);
  private baseURL_USER = `${environment.baseURL}/user/auth/exchanges`;
  private baseURL_SELLER = `${environment.baseURL}/seller/auth/exchanges`;

  // ========== MÉTODOS USER AUTH ==========

  // Crear una oferta de intercambio
  crearOfertaIntercambio(payload: ExchangeOfferRequest, token: string): Observable<ExchangeOfferResponse> {
    return this.http.post<ExchangeOfferResponse>(`${this.baseURL_USER}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Obtener una oferta por ID y ID de usuario
  getOfertaByIdAndUser(id: number, idUser: number, token: string): Observable<ExchangeOfferResponse> {
    return this.http.get<ExchangeOfferResponse>(`${this.baseURL_USER}/${id}/user/${idUser}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Obtener todas las ofertas hechas por el usuario
  getOfertasPorUsuario(idUser: number, token: string): Observable<ExchangeOfferResponse[]> {
    return this.http.get<ExchangeOfferResponse[]>(`${this.baseURL_USER}/user/${idUser}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Obtener todas las ofertas recibidas como vendedor (vía user auth)
  getOfertasPorVendedor(idSeller: number, token: string): Observable<ExchangeOfferResponse[]> {
    return this.http.get<ExchangeOfferResponse[]>(`${this.baseURL_USER}/seller/${idSeller}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // ========== MÉTODOS SELLER AUTH ==========

  // Obtener todas las ofertas recibidas por producto (como vendedor)
  getOfertasPorProductoYVendedor(idProducto: number, idSeller: number, token: string): Observable<ExchangeOfferResponse[]> {
    return this.http.get<ExchangeOfferResponse[]>(`${this.baseURL_SELLER}/product/${idProducto}/seller/${idSeller}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Aceptar o rechazar oferta (PATCH)
  responderOferta(idOferta: number, idVendedor: number, aceptar: boolean, token: string): Observable<void> {
    return this.http.patch<void>(
      `${this.baseURL_SELLER}/${idOferta}/seller/${idVendedor}?aceptar=${aceptar}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }
}