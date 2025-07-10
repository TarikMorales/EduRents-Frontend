import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatSnackBarModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  controlHasError(control: string, error: string){
    return this.forgotPasswordForm.controls[control].hasError(error);
  }

  onsubmit(){
    if(this.forgotPasswordForm.invalid){
      return;
    };

    const email: string = this.forgotPasswordForm.value.correo;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.showSnackBar('Se ha enviado un correo de recuperación');
        this.router.navigate(['/auth/verify-token']);
      },
      error: () => {
        this.showSnackBar('Error al enviar el correo de recuperación');
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
