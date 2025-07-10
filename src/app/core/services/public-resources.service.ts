import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Career } from '../../shared/model/public-resources/career.model';
import { Category } from '../../shared/model/product/category.model';
import { CourseCareer } from '../../shared/model/product/course-career.model';
import { ProductResponse } from '../../shared/model/product/product-response.model';

@Injectable({
  providedIn: 'root'
})
export class PublicResourcesService {

  private baseURL = `${environment.baseURL}/public`;
  private http = inject(HttpClient);

  constructor() { }

  getCarreras() : Observable<Career[]> {
    return this.http.get<Career[]>(`${this.baseURL}/careers`);
  }
  
  getCategorias(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseURL}/categories`);
  }

  getCursosCarreras(): Observable<CourseCareer[]> {
    return this.http.get<CourseCareer[]>(`${this.baseURL}/courses/career`);
  }

  getProductoPorId(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseURL}/products/${id}`);
  }

}