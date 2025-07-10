import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../../shared/model/profile/user-profile.model';
import { Observable, tap } from 'rxjs';
import { UserSeller } from '../../shared/model/profile/user-seller.model';
import { SellerRequest } from '../../shared/model/profile/seller-request.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL = `${environment.baseURL}/user/auth/users`;
  private baseURLSeller = `${environment.baseURL}/user/auth/sellers`;
  private baseURLSellerData = `${environment.baseURL}/public/sellers`;
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

  constructor() { }

  updateProfile(profileData: UserProfile, token: string): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseURL}/${profileData.id}`, profileData, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(updatedProfile => {

        const currentProfile = this.storageService.getAuthData();
        if (currentProfile) {
          currentProfile.correo = updatedProfile.correo;
          currentProfile.rol = updatedProfile.rol;
          currentProfile.ciclo = updatedProfile.ciclo;
          currentProfile.nombres = updatedProfile.nombres;
          currentProfile.apellidos = updatedProfile.apellidos;
          currentProfile.carrera = updatedProfile.carrera;
          currentProfile.codigoUniversitario = updatedProfile.codigo_universitario;
          this.storageService.setAuthData(currentProfile);
        }
        
      })
    )
  }

  updatePhoto(fotoData: { id: number, fotoUrl: string }, token: string): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.baseURL}/${fotoData.id}/photo`, null,{
      headers: { Authorization: `Bearer ${token}` },
      params: { urlFoto: fotoData.fotoUrl }
    }).pipe(
      tap(updatedProfile => {
        const currentProfile = this.storageService.getAuthData();
        if (currentProfile) {
          console.log(updatedProfile);
          currentProfile.fotoUrl = updatedProfile.foto_url;
          this.storageService.setAuthData(currentProfile);
        }
      })
    );
  }

  makeSeller(userId: number, sellerData: SellerRequest, token: string): Observable<UserSeller> {
    return this.http.post<UserSeller>(`${this.baseURLSeller}/user/${userId}`, sellerData, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(userSeller => {
        const currentProfile = this.storageService.getAuthData();
        if (currentProfile) {
          currentProfile.rol = 'SELLER';
          this.storageService.setAuthData(currentProfile);
        }
        this.storageService.setUserSellerData(userSeller);
      })
    );
  }

  getUserSellerData(userId: number): Observable<UserSeller> {
    return this.http.get<UserSeller>(`${this.baseURLSellerData}/${userId}`).pipe(
      tap(userSeller => this.storageService.setUserSellerData(userSeller))
    );
  }

}
