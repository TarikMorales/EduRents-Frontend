import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { TransactionDTO } from '../../shared/model/transaction/transaction.model';
import { AuthService } from './auth.service';
import { Reclamo } from '../../shared/model/transaction/reclamo.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);

  private baseURL = `${environment.baseURL}/user/auth/transactions`;
  private sellerBaseURL = `${environment.baseURL}/seller/auth/transactions`;

  // ============ MÉTODOS PARA USUARIO ============

  getTransactionByIdAndUser(idTransaccion: number, idUsuario: number, token: string): Observable<TransactionDTO> {
  return this.http.get<TransactionDTO>(`${this.baseURL}/${idTransaccion}/user/${idUsuario}`, {
    headers: { Authorization: `Bearer ${token}` }
    });
  }

  getTransactionsByUser(idUsuario: number, token: string, estado = '', metodo = ''): Observable<TransactionDTO[]> {
  let url = `${this.baseURL}/user/${idUsuario}`;

  if (estado && metodo) {
    url = `${this.baseURL}/user/${idUsuario}/paymentMethod/${metodo}/state/${estado}`;
  } else if (estado) {
    url = `${this.baseURL}/user/${idUsuario}/state/${estado}`;
  } else if (metodo) {
    url = `${this.baseURL}/user/${idUsuario}/paymentMethod/${metodo}`;
  }

  return this.http.get<TransactionDTO[]>(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
  getTransactionByUserAndProduct(idUsuario: number, idProducto: number, token: string): Observable<TransactionDTO> {
    return this.http.get<TransactionDTO>(`${this.baseURL}/user/${idUsuario}/product/${idProducto}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  crearTransaccion(payload: any, token: string): Observable<TransactionDTO> {
    return this.http.post<TransactionDTO>(`${this.baseURL}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  confirmarTransaccion(id: number, token: string): Observable<any> {
    return this.http.put(`${this.baseURL}/${id}/confirm`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  cancelarTransaccion(id: number, token: string): Observable<any> {
    return this.http.delete(`${this.baseURL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  reclamarTransaccion(id: number,  body: Reclamo, token: string): Observable<any> {
    return this.http.put(`${this.baseURL}/${id}/claim`, body, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // ============ MÉTODOS PARA VENDEDOR ============

  getTransactionsBySeller(idVendedor: number, token: string, estado = '', metodo = ''): Observable<TransactionDTO[]> {
    let url = `${this.sellerBaseURL}/seller/${idVendedor}`;

    if (estado && metodo) {
      url = `${this.sellerBaseURL}/seller/${idVendedor}/paymentMethod/${metodo}/state/${estado}`;
    } else if (estado) {
      url = `${this.sellerBaseURL}/seller/${idVendedor}/state/${estado}`;
    } else if (metodo) {
      url = `${this.sellerBaseURL}/seller/${idVendedor}/paymentMethod/${metodo}`;
    }

    return this.http.get<TransactionDTO[]>(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

}
