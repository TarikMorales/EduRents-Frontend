import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../shared/model/register/register-request.model';
import { PublicResourcesService } from '../../../core/services/public-resources.service';
import { Career } from '../../../shared/model/public-resources/career.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  numeros: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  opcionesCarreras: Career[] = [];

  registerForm: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private publicResourcesService = inject(PublicResourcesService);

  constructor(){
    this.registerForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      ciclo: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      id_carrera: ['', [Validators.required]],
      foto_url: ['', [Validators.required]],
      codigo_universitario: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.publicResourcesService.getCarreras().subscribe(data => {
      this.opcionesCarreras = data;
    });

    let datos: { nombre?: string; correo?: string } | null = null;
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { nombre?: string; correo?: string };

    if (state && (state.nombre || state.correo)) {
      console.log('Recibido desde state:', state);
      datos = state;
      localStorage.setItem('registroDesdeGoogle', JSON.stringify(state));
    } else {
      const stored = localStorage.getItem('registroDesdeGoogle');
      if (stored) {
        datos = JSON.parse(stored);
        console.log('Recuperado desde localStorage:', datos);
      } else {
        console.log('No se recibieron datos del estado de navegación.');
      }
    }

    // Si se obtuvieron datos, llenar el formulario
    if (datos) {
      this.registerForm.patchValue({
        nombres: datos.nombre ?? '',
        correo: datos.correo ?? ''
      });

      this.registerForm.get('correo')?.disable();

    }

  }

  controlHasError(control: string, error: string){
    return this.registerForm.controls[control].hasError(error);
  }

  onSubmit(){
    if(this.registerForm.invalid){
      return;
    };

    const credentials: RegisterRequest = this.registerForm.getRawValue();

    this.authService.register(credentials).subscribe({
      next: () => {
        this.showSnackBar('Registro exitoso');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.showSnackBar('Error en el registro. Por favor, intenta de nuevo.');
      },
    });
  }

  private showSnackBar(message: string): void{
    this.snackBar.open(message, 'Close',{
      duration: 2000,
      verticalPosition: 'top'
    })
  }

}
