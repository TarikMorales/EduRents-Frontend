import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Career } from '../../../shared/model/public-resources/career.model';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PublicResourcesService } from '../../../core/services/public-resources.service';
import { AuthResponse } from '../../../shared/model/login/auth-response.model';
import { UserProfile } from '../../../shared/model/profile/user-profile.model';
import { UserService } from '../../../core/services/user.service';
import { UserSeller } from '../../../shared/model/profile/user-seller.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  numeros: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  opcionesCarreras: Career[] = [];
  foto : string = "https://cdn-icons-png.flaticon.com/512/12225/12225881.png";
  esVendedor: boolean = false;
  confiabilidad: string = '';
  buenaAtencion: string = '';
  sinDemoras: string = '';
  correoVendedor: string = '';
  telefonoVendedor: number = 0;
  presentacionVendedor: string = '';
  nombreNegocioVendedor: string = '';

  profileForm: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private publicResourcesService = inject(PublicResourcesService);
  private userService = inject(UserService);

  constructor(){
    this.profileForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      rol: ['', [Validators.required]],
      ciclo: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      id_carrera: ['', [Validators.required]],
      codigo_universitario: ['', [Validators.required]]
    });
  }

  ngOnInit() {

    if(!this.authService.isAuthenticated()){
      this.router.navigate(['/auth/login']);
      return;
    }

    this.publicResourcesService.getCarreras().subscribe(data => {
      this.opcionesCarreras = data;

      let carrera_id = data.find(carrera => carrera.nombre === this.authService.getUser()?.carrera)?.id;

      const user : AuthResponse = this.authService.getUser()!;
      this.profileForm.patchValue({
        correo: user.correo,
        rol: user.rol,
        ciclo: user.ciclo,
        nombres: user.nombres,
        apellidos: user.apellidos,
        id_carrera: carrera_id,
        codigo_universitario: user.codigoUniversitario
      });

      this.foto = user.fotoUrl || this.foto;

      this.esVendedor = user.rol === 'SELLER';

      if(this.esVendedor){
        this.obtenerDatosUsuarioVendedor();
      }

    });

    this.profileForm.get('rol')?.disable();
    this.profileForm.get('correo')?.disable();
    this.profileForm.get('id_carrera')?.disable();

  }

  onSubmit(){
    if(this.profileForm.invalid){
      return;
    };

    const profileData: UserProfile = this.profileForm.getRawValue();
    profileData.id = this.authService.getUser()?.id || 0;

    this.userService.updateProfile(profileData, this.authService.getUser()?.token || '').subscribe({
      next: () => {
        this.showSnackBar('Perfil actualizado exitosamente');
        this.router.navigate(['/']);
      },
      error: () => {
        this.showSnackBar('Error en la actualización del perfil.');
        this.router.navigate(['/']);
      },
    });
  }

  controlHasError(control: string, error: string){
    return this.profileForm.controls[control].hasError(error);
  }

  cambiarARolVendedor() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.authService.getUser()?.rol === 'SELLER') {
      this.showSnackBar('Ya eres un vendedor');
      this.router.navigate(['/user']);
      return;
    }

    this.router.navigate(['/user/make-seller']);
  }

  obtenerDatosUsuarioVendedor() {
    this.userService.getUserSellerData(this.authService.getUser()?.id || 0).subscribe({
      next: (data) => {
        this.confiabilidad = data.confiabilidad ? "Sí" : "No";
        this.buenaAtencion = data.buena_atencion ? "Sí" : "No";
        this.sinDemoras = data.sin_demoras ? "Sí" : "No";
        this.correoVendedor = data.correoElectronico;
        this.telefonoVendedor = data.numeroTelefono;
        this.presentacionVendedor = data.presentacion;
        this.nombreNegocioVendedor = data.nombreNegocio;
      },
      error: () => {
        this.showSnackBar('Error al obtener datos del vendedor.');
      }
    });
  }

  private showSnackBar(message: string): void{
    this.snackBar.open(message, 'Close',{
      duration: 2000,
      verticalPosition: 'top'
    })
  }

}
