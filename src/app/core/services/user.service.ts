import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../../shared/model/profile/user-profile.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL = `${environment.baseURL}/user/auth/users`;
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

}
