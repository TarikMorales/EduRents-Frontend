import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Course } from '../models/course';
import { Career } from '../models/career';
import { Observable } from 'rxjs';
import {Product} from "../models/product/producto";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private baseUrl = 'http://localhost:8080/api/v1/public/courses'; // cambia si usas otra URL

  constructor(private http: HttpClient) {}

  getCoursesByCareer(careerId: number): Observable<Course[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWxhQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3NTM1OTkyMjF9.uoTHpASoTNDoQlMI-G9-xu2TzelVEMAVqftLXuZehx_qQSox9vWlDJ2aWRxPReax5AzwGhedpDHRw60VCv_snQ'
    });
    return this.http.get<Course[]>(`${this.baseUrl}/career/${careerId}`, { headers });
  }
}
