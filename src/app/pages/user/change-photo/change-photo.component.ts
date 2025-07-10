import { Component, inject, OnInit } from '@angular/core';
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PublicResourcesService } from '../../../core/services/public-resources.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-change-photo',
  standalone: true,
  imports: [FooterComponent, NavbarComponent, CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './change-photo.component.html',
  styleUrl: './change-photo.component.css'
})
export class ChangePhotoComponent implements OnInit{

  foto : string = "https://cdn-icons-png.flaticon.com/512/12225/12225881.png";

  photoForm: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private publicResourcesService = inject(PublicResourcesService);
  private userService = inject(UserService);

  constructor(){
    this.photoForm = this.fb.group({
      foto_url: ['', [Validators.required]],
    });
  }

  ngOnInit() {

    if(!this.authService.isAuthenticated()){
      this.router.navigate(['/auth/login']);
      return;
    }

    const user = this.authService.getUser();
    if (user && user.fotoUrl) {
      this.foto = user.fotoUrl;
      this.photoForm.patchValue({ foto_url: user.fotoUrl });
    }

    this.photoForm.get('foto_url')?.valueChanges.subscribe((url: string) => {
      this.foto = url;
    });
  }

  onSubmit(){
    if(this.photoForm.invalid){
      return;
    };

    const fotoNueva: string = this.photoForm.value.foto_url;
    const id: number = this.authService.getUser()?.id || 0;

    const data = {
      id: id,
      fotoUrl: fotoNueva
    }

    this.userService.updatePhoto(data, this.authService.getUser()?.token || '').subscribe({
      next: () => {
        this.showSnackBar('Foto de perfil actualizada exitosamente');
        this.router.navigate(['/']);
      },
      error: () => {
        this.showSnackBar('Error en la actualización de la foto de perfil.');
        this.router.navigate(['/']);
      },
    });
  }

  onImageError() {
    this.foto = 'https://cdn-icons-png.flaticon.com/512/12225/12225881.png';
  }

  private showSnackBar(message: string): void{
    this.snackBar.open(message, 'Close',{
      duration: 2000,
      verticalPosition: 'top'
    })
  }

}
