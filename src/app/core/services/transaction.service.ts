import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { TransactionDTO } from '../../shared/model/transaction/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private baseURL = `${environment.baseURL}/transactions`;
  
  getTransactionsByUser(idUsuario: number, estado = '', metodo = ''): Observable<TransactionDTO[]> {
    return this.http.get<TransactionDTO[]>(`${this.baseURL}/usuario/${idUsuario}`, {
      params: {
        estado,
        metodoPago: metodo
      }
    });
  }

  crearTransaccion(payload: any): Observable<TransactionDTO> {
    return this.http.post<TransactionDTO>(`${this.baseURL}`, payload);
  }

  confirmarTransaccion(id: number): Observable<any> {
    return this.http.put(`${this.baseURL}/${id}/confirmar`, {});
  }

  cancelarTransaccion(id: number): Observable<any> {
    return this.http.put(`${this.baseURL}/${id}/cancelar`, {});
  }

  reclamarTransaccion(id: number, motivo: string): Observable<any> {
    return this.http.put(`${this.baseURL}/${id}/reclamar`, { motivo });
  }
}