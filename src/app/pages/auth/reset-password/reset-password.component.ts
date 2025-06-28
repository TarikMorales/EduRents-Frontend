import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { passwordMatchValidator } from './validators';
import { CommonModule } from '@angular/common';
import { ResetPasswordRequest } from '../../../shared/model/reset-password/reset-password-request.model';
import { RecoverProcessResponse } from '../../../shared/model/forgot-password/recover-process-response.model';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatSnackBarModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})

export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  dataRecover: RecoverProcessResponse = {
    id: 0,
    correo: '',
    fechaExpiracion: '',
  };

  tokenRecuperacion: string = '';

  constructor() {
    this.resetPasswordForm = this.fb.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      nuevaContrasenaRepetida: ['', [Validators.required]]
    }, { validators: passwordMatchValidator('nuevaContrasena', 'nuevaContrasenaRepetida') });
  }

  ngOnInit() {
    if (!this.authService.getRecoverData()) {
      this.showSnackBar('No se ha encontrado un proceso de recuperación vigente');
      this.router.navigate(['/auth/forgot-password']);
    } else if (!this.authService.getTokenRecuperacion()) {
      this.showSnackBar('No se ha ingresado un token de recuperación válido previamente');
      this.router.navigate(['/auth/forgot-password']);
    } else {
      this.dataRecover = this.authService.getRecoverData()!;
      this.tokenRecuperacion = this.authService.getTokenRecuperacion()!;
    }

  }

  controlHasError(control: string, error: string){
    return this.resetPasswordForm.controls[control].hasError(error);
  }

  onsubmit(){
    if(this.resetPasswordForm.invalid){
      return;
    };

    const data: ResetPasswordRequest = this.resetPasswordForm.value;

    const credentials = {
      id: this.dataRecover.id,
      token: this.tokenRecuperacion,
      newPassword: data.nuevaContrasena,
    }

    this.authService.resetPassword(credentials).subscribe({
      next: () => {

        this.showSnackBar('Contraseña actualizada correctamente');
        this.router.navigate(['/auth/login']);

      },
      error: () => {
        this.showSnackBar('Ha ocurrido un error al actualizar la contraseña. Por favor, intente nuevamente.');
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
