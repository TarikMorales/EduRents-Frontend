import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { SellerProfileResponse } from '../../shared/model/public-resources/seller-profile-response.model';
import { Image } from '../../shared/model/product/image.model';

export interface SellerReputationDTO {
  confiabilidad: boolean;
  sin_demoras: boolean;
  buena_atencion: boolean;
  calificacion: number;
}

export interface ShowProductDTO {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  fecha_expiracion: string;
  imagenes: Image[];
  categorias: string[];
  cursos_carreras: string[];
}

@Injectable({ providedIn: 'root' })
export class SellerProfileService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.baseURL}/public/sellers`;

  getSellerById(id: number): Observable<SellerProfileResponse> {
    return this.http.get<SellerProfileResponse>(`${this.baseUrl}/${id}`);
  }

  getSellerByName(name: string): Observable<SellerProfileResponse> {
    return this.http.get<SellerProfileResponse>(`${this.baseUrl}/name/${name}`);
  }

  getSellerReputationById(id: number): Observable<SellerReputationDTO> {
    return this.http.get<SellerReputationDTO>(`${this.baseUrl}/${id}/reputation`);
  }

  getSellerProducts(id: number): Observable<ShowProductDTO[]> {
    return this.http.get<ShowProductDTO[]>(`${this.baseUrl}/${id}/products`);
  }
} 