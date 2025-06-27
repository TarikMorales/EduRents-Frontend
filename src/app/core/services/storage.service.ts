import { Injectable } from '@angular/core';
import { AuthResponse } from '../../shared/model/login/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private authKey = 'edurents_auth';

  constructor() {}

  setAuthData(data: AuthResponse): void {
    console.log(data);
    localStorage.setItem(this.authKey, JSON.stringify(data));
  }

  getAuthData(): AuthResponse | null {
    const data = localStorage.getItem(this.authKey);
    return data ? JSON.parse(data) as AuthResponse : null;
  }

  clearAuthData(): void {
    localStorage.removeItem(this.authKey);
  }
}
