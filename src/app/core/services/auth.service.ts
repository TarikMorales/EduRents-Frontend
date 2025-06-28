
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { AuthRequest } from '../../shared/model/login/auth-request.model';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../../shared/model/login/auth-response.model';
import { RegisterRequest } from '../../shared/model/register/register-request.model';
import { RegisterResponse } from '../../shared/model/register/register-response.model';
import { RecoverProcessResponse } from '../../shared/model/forgot-password/recover-process-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseURL = `${environment.baseURL}/auth`;
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

  constructor() { }

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseURL}/login`, authRequest)
    .pipe(
      tap(response => this.storageService.setAuthData(response))
    );
  }

  loginWithGoogle(idToken: string): Observable<any> {
    return this.http.post(`${this.baseURL}/login/google`, { idToken });
  }

  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseURL}/register`,
      registerRequest);
  }

  logout(): void {
    this.storageService.clearAuthData();
  forgotPassword(email: string): Observable<RecoverProcessResponse> {
    const params = new HttpParams().set('correo', email);
    return this.http.post<RecoverProcessResponse>(`${this.baseURL}/forgot-password`, null, { params })
    .pipe(
      tap(response => {
        this.storageService.setRecoverData(response);
      })
    );
  }

  verifyToken(credentials: { id: number, token: string }): Observable<{ message: string }> {
    const params = new HttpParams().set('token', credentials.token);
    return this.http.post<{ message: string }>(`${this.baseURL}/verify-token/${credentials.id}`, null, { params });
  }

  resetPassword(credentials: { id: number, token: string, newPassword: string }): Observable<void> {
    const params = new HttpParams().set('token', credentials.token).set('newPassword', credentials.newPassword);
    return this.http.put<void>(`${this.baseURL}/reset-password/${credentials.id}`, null, { params })
    .pipe(
      tap(() => {
        this.removeRecoverData();
      })
    )
  }

  logout(): void {
    this.storageService.clearAuthData();
    this.storageService.clearUserSellerData();
    // @ts-ignore
    google.accounts.id.disableAutoSelect();
  }

  isAuthenticated(): boolean {
    return this.storageService.getAuthData() !== null;
  }

  getUser(): AuthResponse | null {
    const authData = this.storageService.getAuthData();
    return authData ? authData : null;
  }

  getRecoverData(): RecoverProcessResponse | null {
    const recoverData = this.storageService.getRecoverData();
    return recoverData ? recoverData : null;
  }

  getUserRole(): string | null {
    const authData = this.storageService.getAuthData();
    return authData ? authData.rol : null;
  }

  getTokenRecuperacion(): string | null {
    return localStorage.getItem('tokenRecuperacion');
  }

  removeRecoverData(): void {
    this.storageService.clearRecoverData();
    localStorage.removeItem('tokenRecuperacion');
  }

}
