import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { ProductResponse } from '../../shared/model/product/product-response.model';

@Injectable({ providedIn: 'root' })
export class FollowedProductService {
  private baseURL = `${environment.baseURL}/user/auth/followed-products`;
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

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

  followProduct(idUser: number, idProduct: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseURL}/product/${idProduct}/user/${idUser}/follow`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  unfollowProduct(idUser: number, idProduct: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseURL}/product/${idProduct}/user/${idUser}/follow`,
      { headers: this.getAuthHeaders() }
    );
  }

  getFollowedProducts(idUser: number): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(
      `${this.baseURL}/user/${idUser}`,
      { headers: this.getAuthHeaders() }
    );
  }

}
