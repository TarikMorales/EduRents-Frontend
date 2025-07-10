import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ReviewResponse } from '../../../shared/model/reviews/review-response.model';
import { Observable } from 'rxjs';
import { ReviewRequest } from '../../../shared/model/reviews/review-request.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewAuthService {

  private baseURL = `${environment.baseURL}/user/auth/reviews`;
  private http = inject(HttpClient);

  constructor() { }

  getReviewsBySellerIdAndNotUserId(sellerId: number, userId: number, token: string) : Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${this.baseURL}/seller/${sellerId}/reviews/others/${userId}`, 
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  getReviewBySellerIdAndUserId(sellerId: number, userId: number, token: string) : Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(`${this.baseURL}/seller/${sellerId}/reviews/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  existsReviewBySellerIdAndUserId(sellerId: number, userId: number, token: string) : Observable<boolean> {
    return this.http.get<boolean>(`${this.baseURL}/seller/${sellerId}/reviews/user/${userId}/exists`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  createReview(review: ReviewRequest, token: string): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(`${this.baseURL}`, review,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  updateReview(idReview: number, review: ReviewRequest, token: string): Observable<ReviewResponse> {
    return this.http.put<ReviewResponse>(`${this.baseURL}/${idReview}`, review,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  deleteReview(idReview: number, token: string): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${idReview}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

}