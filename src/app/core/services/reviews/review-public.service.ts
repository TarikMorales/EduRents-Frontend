import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewResponse } from '../../../shared/model/reviews/review-response.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewPublicService {

  private baseURL = `${environment.baseURL}/public/reviews`;
  private http = inject(HttpClient);

  constructor() { }

  getReviewsBySellerId(sellerId: number) : Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${this.baseURL}/seller/${sellerId}`);
  }

  getReviewById(reviewId: number): Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(`${this.baseURL}/${reviewId}`);
  }

}
