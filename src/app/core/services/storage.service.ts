import { Injectable } from '@angular/core';
import { AuthResponse } from '../../shared/model/login/auth-response.model';
import { RecoverProcessResponse } from '../../shared/model/forgot-password/recover-process-response.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private authKey = 'edurents_auth';
  private recoverKey = 'edurents_recover';

  constructor() {}

  setAuthData(data: AuthResponse): void {
    console.log(data);
    localStorage.setItem(this.authKey, JSON.stringify(data));
  }

  setRecoverData(data: RecoverProcessResponse): void {
    localStorage.setItem(this.recoverKey, JSON.stringify(data));
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
}
