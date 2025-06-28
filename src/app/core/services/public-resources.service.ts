import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Career } from '../../shared/model/public-resources/career.model';

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

}
