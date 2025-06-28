import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ProductRequest } from '../../shared/model/product/product-request.model';
import { Observable } from 'rxjs';
import { ProductResponse } from '../../shared/model/product/product-response.model';

@Injectable({
  providedIn: 'root'
})
export class SellerProductService {

  private baseURLCreate = `${environment.baseURL}/seller/auth/products`;
  private baseURLOptions = `${environment.baseURL}/user/auth/products`;
  private http = inject(HttpClient);

  constructor() { }

  createProduct(productData: ProductRequest, token: string) {
    return this.http.post<ProductRequest>(`${this.baseURLCreate}`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getProductsBySeller(id: number, token: string) : Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${this.baseURLOptions}/seller/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateProduct(productId: number, productData: ProductRequest, token: string) {
    return this.http.put<ProductRequest>(`${this.baseURLCreate}/${productId}`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

}
