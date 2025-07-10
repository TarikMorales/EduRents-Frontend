import { Injectable } from '@angular/core';
import { AuthResponse } from '../../shared/model/login/auth-response.model';
import { RecoverProcessResponse } from '../../shared/model/forgot-password/recover-process-response.model';
import { UserSeller } from '../../shared/model/profile/user-seller.model';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private productDetailDataKey = 'productDetailData';
    private authDataKey = 'edurents_auth';

  private authKey = 'edurents_auth';
  private recoverKey = 'edurents_recover';
  private sellerKey = 'user_seller';

    setProductDetailData(data: any):void {
        localStorage.setItem(this.productDetailDataKey, JSON.stringify(data));
    }
    
    getProductDetailData(): any {
        const data = localStorage.getItem(this.productDetailDataKey);
        return data ? JSON.parse(data) : null;
    }

  setAuthData(data: AuthResponse): void {
    // console.log(data);
    localStorage.setItem(this.authKey, JSON.stringify(data));
  }

  setRecoverData(data: RecoverProcessResponse): void {
    localStorage.setItem(this.recoverKey, JSON.stringify(data));
  }

  setUserSellerData(data: UserSeller): void {
    localStorage.setItem('user_seller', JSON.stringify(data));
  }

  getUserSellerData(): UserSeller | null {
    const data = localStorage.getItem(this.sellerKey);
    return data ? JSON.parse(data) as UserSeller : null;
  }

  getRecoverData(): RecoverProcessResponse | null {
    const data = localStorage.getItem(this.recoverKey);
    return data ? JSON.parse(data) as RecoverProcessResponse : null;
  }

  getAuthData(): AuthResponse | null {
    const data = localStorage.getItem(this.authKey);
    return data ? JSON.parse(data) as AuthResponse : null;
  }

  clearAuthData(): void {
    localStorage.removeItem(this.authKey);
  }

  clearRecoverData(): void {
    localStorage.removeItem(this.recoverKey);
  }

  clearUserSellerData(): void {
    localStorage.removeItem(this.sellerKey);
  }
}
