import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Career } from '../models/career';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  private baseUrl = 'http://localhost:8080/api/v1/public/career'; // cambia si usas otra URL

  constructor(private http: HttpClient) {}

  getAllCareers(): Observable<Career[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWxhQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3NTM1OTkyMjF9.uoTHpASoTNDoQlMI-G9-xu2TzelVEMAVqftLXuZehx_qQSox9vWlDJ2aWRxPReax5AzwGhedpDHRw60VCv_snQ'
    });
    return this.http.get<Career[]>(this.baseUrl, { headers });
  }
}
