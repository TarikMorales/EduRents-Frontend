import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/v1/public/products'; // Asegúrate de que esta URL sea la correcta

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
    return this.http.get<Product[]>(`${this.apiUrl}/career/${careerId}`, { headers });
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
}
