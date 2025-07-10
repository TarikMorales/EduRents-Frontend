import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../shared/model/product-filter/product/producto';
import { environment } from '../../../../environments/environment';
import { ProductResponse } from '../../../shared/model/product/product-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.baseURL}/public/products`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {

    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductsByName(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search/${name}`);
  }

  getProductById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(categoriaId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoriaId}`);
  }

  getProductsByCareer(careerId: number): Observable<Product[]> {
    const url = `${this.apiUrl}/career/${careerId}`;
    console.log('🌐 Llamando al endpoint de carrera:', url);
    console.log('🆔 ID de carrera:', careerId);
    return this.http.get<Product[]>(url);
  }

  getProductsByCareerAndCourse(careerId: number, courseId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/career/${careerId}/course/${courseId}`);
  }

  getProductsByCareerAndCourseAndCategory(careerId: number, courseId: number, categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/career/${careerId}/course/${courseId}/category/${categoryId}`);
  }

  getProductsRecents(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/recents`);
  }
  getProductsTopExchanges(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/top-exchanges`);
  }
  getProductsTrendy(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/trendy`);
  }

  //Por views

  getProductsByCategoryViews(categoriaId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoriaId}/views`);
  }

  getProductsByCareerViews(careerId: number): Observable<Product[]> {
    const url = `${this.apiUrl}/career/${careerId}/views`;
    console.log('🌐 Llamando al endpoint de carrera con vistas:', url);
    console.log('🆔 ID de carrera:', careerId);
    return this.http.get<Product[]>(url);
  }

  getProductsByCareerAndCourseViews(careerId: number, courseId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/career/${careerId}/course/${courseId}/views`);
  }

  getProductsByCareerAndCourseAndCategoryViews(careerId: number, courseId: number, categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/career/${careerId}/course/${courseId}/category/${categoryId}/views`);
  }

  getProductosFiltrados(filtros: any): Observable<Product[]> {
    let params = new HttpParams();

    if (filtros.categorias?.length) {
      filtros.categorias.forEach((id: number) => {
        params = params.append('categoria', id);
      });
    }

    if (filtros.carreras?.length) {
      filtros.carreras.forEach((id: number) => {
        params = params.append('carrera', id);
      });
    }

    if (filtros.cursos?.length) {
      filtros.cursos.forEach((id: number) => {
        params = params.append('curso', id);
      });
    }

    if (filtros.precioMin != null) {
      params = params.set('precioMin', filtros.precioMin);
    }

    if (filtros.precioMax != null) {
      params = params.set('precioMax', filtros.precioMax);
    }

    if (filtros.ordenarPorVistas) {
      params = params.set('ordenarPorVistas', 'true');
    }

    if (filtros.estados?.length) {
      filtros.estados.forEach((estado: string) => {
        params = params.append('estado', estado.toUpperCase());
      });
    }

    return this.http.get<Product[]>(`${this.apiUrl}/filtrar`, { params });
  }
}
