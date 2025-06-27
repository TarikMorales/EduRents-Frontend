import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { AuthRequest } from '../../shared/model/login/auth-request.model';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../../shared/model/login/auth-response.model';
import { RegisterRequest } from '../../shared/model/register/register-request.model';
import { RegisterResponse } from '../../shared/model/register/register-response.model';

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

  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseURL}/register`,
      registerRequest);
  }

  logout(): void {
    this.storageService.clearAuthData();
  }

  isAuthenticated(): boolean {
    return this.storageService.getAuthData() !== null;
  }

  getUser(): AuthResponse | null {
    const authData = this.storageService.getAuthData();
    return authData ? authData : null;
  }

  getUserRole(): string | null {
    const authData = this.storageService.getAuthData();
    return authData ? authData.rol : null;
  }

}
