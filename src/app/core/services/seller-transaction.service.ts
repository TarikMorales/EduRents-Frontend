import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionDTO } from '../../shared/model/transaction/transaction.model';
import { ExchangeOfferResponse } from '../../shared/model/exchange-offer/exchange-offer.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SellerTransactionService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.baseURL}`;

  // Transacciones del vendedor
  getTransactionsBySeller(idVendedor: number): Observable<TransactionDTO[]> {
    return this.http.get<TransactionDTO[]>(`${this.baseUrl}/seller/auth/transactions/seller/${idVendedor}`);
  }
}
