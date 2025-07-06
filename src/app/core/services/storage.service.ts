import { Injectable } from '@angular/core';
import { AuthResponse } from '../../shared/model/login/auth-response.model';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private productDetailDataKey = 'productDetailData';
    private authDataKey = 'edurents_auth';

    constructor() { }

    setProductDetailData(data: any):void {
        localStorage.setItem(this.productDetailDataKey, JSON.stringify(data));
    }
    
    getProductDetailData(): any {
        const data = localStorage.getItem(this.productDetailDataKey);
        return data ? JSON.parse(data) : null;
    }

    clearProductDetailData(): void {
        localStorage.removeItem(this.productDetailDataKey);
    }

    setAuthData(data: AuthResponse): void {
        localStorage.setItem(this.authDataKey, JSON.stringify(data));
    }

    getAuthData(): AuthResponse | null {
        const data = localStorage.getItem(this.authDataKey);
        return data ? JSON.parse(data) as AuthResponse : null;
    }

    clearAuthData(): void {
        localStorage.removeItem(this.authDataKey);
    }

    clearStorage(): void {
        localStorage.clear();
    }
}