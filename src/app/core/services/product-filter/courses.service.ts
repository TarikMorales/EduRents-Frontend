import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../../../shared/model/product-filter/course';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private baseUrl = `${environment.baseURL}/public/courses`; // cambia si usas otra URL

  constructor(private http: HttpClient) {}

  getCoursesByCareer(careerId: number): Observable<Course[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWxhQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3NTM1OTkyMjF9.uoTHpASoTNDoQlMI-G9-xu2TzelVEMAVqftLXuZehx_qQSox9vWlDJ2aWRxPReax5AzwGhedpDHRw60VCv_snQ'
    });
    return this.http.get<Course[]>(`${this.baseUrl}/career/${careerId}`, { headers });
  }
}
