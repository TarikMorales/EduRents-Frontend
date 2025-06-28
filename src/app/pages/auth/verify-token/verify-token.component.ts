import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RecoverProcessResponse } from '../../../shared/model/forgot-password/recover-process-response.model';

@Component({
  selector: 'app-verify-token',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatSnackBarModule, RouterLink],
  templateUrl: './verify-token.component.html',
  styleUrl: './verify-token.component.css'
})
export class VerifyTokenComponent implements OnInit{

  verifyTokenForm: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  dataRecover: RecoverProcessResponse = {
    id: 0,
    correo: '',
    fechaExpiracion: '',
  };

  constructor() {
    this.verifyTokenForm = this.fb.group({
      token: ['', [Validators.required, Validators.minLength(36), Validators.maxLength(36)]]
    });
  }

  ngOnInit() {
    if (!this.authService.getRecoverData()) {
      this.showSnackBar('No se ha encontrado un proceso de recuperación vigente');
      this.router.navigate(['/auth/forgot-password']);
    } else {
      this.dataRecover = this.authService.getRecoverData()!;
    }

  }

  controlHasError(control: string, error: string){
    return this.verifyTokenForm.controls[control].hasError(error);
  }

  onsubmit(){
    if(this.verifyTokenForm.invalid){
      return;
    };

    const token: string = this.verifyTokenForm.value.token.trim();

    const credentials = {
      id: this.dataRecover.id,
      token: token,
    };

    this.authService.verifyToken(credentials).subscribe({
      next: (res) => {
        if (res.message === 'Token válido, proceso activado correctamente') {
          this.showSnackBar('Verificación exitosa, puede proceder a cambiar su contraseña');
          localStorage.setItem('tokenRecuperacion', credentials.token);
          this.router.navigate(['/auth/reset-password']);
        } else {
          this.showSnackBar('Token inválido o expirado.');
          this.router.navigate(['/auth/forgot-password']);
        }
      },
      error: () => {
        this.showSnackBar('Ha ocurrido un error al verificar el token. Verifique si es correcto o si el proceso de recuperación ha expirado');
        this.router.navigate(['/auth/forgot-password']);
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
