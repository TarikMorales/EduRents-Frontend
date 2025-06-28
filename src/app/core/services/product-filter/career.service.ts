import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Career } from '../../../shared/model/product-filter/career';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  private baseUrl = `${environment.baseURL}/public/careers`;

  constructor(private http: HttpClient) {}

  getAllCareers(): Observable<Career[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWxhQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3NTM1OTkyMjF9.uoTHpASoTNDoQlMI-G9-xu2TzelVEMAVqftLXuZehx_qQSox9vWlDJ2aWRxPReax5AzwGhedpDHRw60VCv_snQ'
    });
    return this.http.get<Career[]>(this.baseUrl, { headers });
  }
}
