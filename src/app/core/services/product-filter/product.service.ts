import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../shared/model/product-filter/product/producto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.baseURL}/public/products`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWxhQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3NTM1OTkyMjF9.uoTHpASoTNDoQlMI-G9-xu2TzelVEMAVqftLXuZehx_qQSox9vWlDJ2aWRxPReax5AzwGhedpDHRw60VCv_snQ'
    });

    return this.http.get<Product[]>(this.apiUrl, { headers });
  }

  getProductsByCategory(categoriaId: number): Observable<Product[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWxhQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3NTM1OTkyMjF9.uoTHpASoTNDoQlMI-G9-xu2TzelVEMAVqftLXuZehx_qQSox9vWlDJ2aWRxPReax5AzwGhedpDHRw60VCv_snQ'
    });
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoriaId}`, { headers });
  }

  getProductsByCareer(careerId: number): Observable<Product[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWxhQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3NTM1OTkyMjF9.uoTHpASoTNDoQlMI-G9-xu2TzelVEMAVqftLXuZehx_qQSox9vWlDJ2aWRxPReax5AzwGhedpDHRw60VCv_snQ'
    });
    const url = `${this.apiUrl}/career/${careerId}`;
    console.log('🌐 Llamando al endpoint de carrera:', url);
    console.log('🆔 ID de carrera:', careerId);
    return this.http.get<Product[]>(url, { headers });
  }

  getProductsByCareerAndCourse(careerId: number, courseId: number): Observable<Product[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWxhQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3NTM1OTkyMjF9.uoTHpASoTNDoQlMI-G9-xu2TzelVEMAVqftLXuZehx_qQSox9vWlDJ2aWRxPReax5AzwGhedpDHRw60VCv_snQ'
    });
    return this.http.get<Product[]>(`${this.apiUrl}/career/${careerId}/course/${courseId}`, { headers });
  }

  getProductsByCareerAndCourseAndCategory(careerId: number, courseId: number, categoryId: number): Observable<Product[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWxhQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3NTM1OTkyMjF9.uoTHpASoTNDoQlMI-G9-xu2TzelVEMAVqftLXuZehx_qQSox9vWlDJ2aWRxPReax5AzwGhedpDHRw60VCv_snQ'
    });
    return this.http.get<Product[]>(`${this.apiUrl}/career/${careerId}/course/${courseId}/category/${categoryId}`, { headers });
  }

  getProductsRecents(): Observable<Product[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWxhQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3NTM1OTkyMjF9.uoTHpASoTNDoQlMI-G9-xu2TzelVEMAVqftLXuZehx_qQSox9vWlDJ2aWRxPReax5AzwGhedpDHRw60VCv_snQ'
    });
    return this.http.get<Product[]>(`${this.apiUrl}/products/recents`, { headers });
  }
  getProductsTopExchanges(): Observable<Product[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWxhQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3NTM1OTkyMjF9.uoTHpASoTNDoQlMI-G9-xu2TzelVEMAVqftLXuZehx_qQSox9vWlDJ2aWRxPReax5AzwGhedpDHRw60VCv_snQ'
    });
    return this.http.get<Product[]>(`${this.apiUrl}/products/top-exchanges`, { headers });
  }
  getProductsTrendy(): Observable<Product[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWxhQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3NTM1OTkyMjF9.uoTHpASoTNDoQlMI-G9-xu2TzelVEMAVqftLXuZehx_qQSox9vWlDJ2aWRxPReax5AzwGhedpDHRw60VCv_snQ'
    });
    return this.http.get<Product[]>(`${this.apiUrl}/products/trendy`, { headers });
  }

  //Por views

  getProductsByCategoryViews(categoriaId: number): Observable<Product[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWxhQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3NTM1OTkyMjF9.uoTHpASoTNDoQlMI-G9-xu2TzelVEMAVqftLXuZehx_qQSox9vWlDJ2aWRxPReax5AzwGhedpDHRw60VCv_snQ'
    });
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoriaId}/views`, { headers });
  }

  getProductsByCareerViews(careerId: number): Observable<Product[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWxhQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3NTM1OTkyMjF9.uoTHpASoTNDoQlMI-G9-xu2TzelVEMAVqftLXuZehx_qQSox9vWlDJ2aWRxPReax5AzwGhedpDHRw60VCv_snQ'
    });
    const url = `${this.apiUrl}/career/${careerId}/views`;
    console.log('🌐 Llamando al endpoint de carrera con vistas:', url);
    console.log('🆔 ID de carrera:', careerId);
    return this.http.get<Product[]>(url, { headers });
  }

  getProductsByCareerAndCourseViews(careerId: number, courseId: number): Observable<Product[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWxhQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3NTM1OTkyMjF9.uoTHpASoTNDoQlMI-G9-xu2TzelVEMAVqftLXuZehx_qQSox9vWlDJ2aWRxPReax5AzwGhedpDHRw60VCv_snQ'
    });
    return this.http.get<Product[]>(`${this.apiUrl}/career/${careerId}/course/${courseId}/views`, { headers });
  }

  getProductsByCareerAndCourseAndCategoryViews(careerId: number, courseId: number, categoryId: number): Observable<Product[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWxhQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3NTM1OTkyMjF9.uoTHpASoTNDoQlMI-G9-xu2TzelVEMAVqftLXuZehx_qQSox9vWlDJ2aWRxPReax5AzwGhedpDHRw60VCv_snQ'
    });
    return this.http.get<Product[]>(`${this.apiUrl}/career/${careerId}/course/${courseId}/category/${categoryId}/views`, { headers });
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

    if (filtros.estado) {
      params = params.set('estado', filtros.estado.toUpperCase()); // Asegúrate que coincida con el enum de Spring
    }

    // 🔐 Aquí se debe enviar el token
    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWxhQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3NTM1OTkyMjF9.uoTHpASoTNDoQlMI-G9-xu2TzelVEMAVqftLXuZehx_qQSox9vWlDJ2aWRxPReax5AzwGhedpDHRw60VCv_snQ'
    });
    return this.http.get<Product[]>(`${this.apiUrl}/filtrar`, { params, headers });
  }
}
