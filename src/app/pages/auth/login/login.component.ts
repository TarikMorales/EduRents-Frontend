import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthRequest } from '../../../shared/model/login/auth-request.model';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatSnackBarModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup; 
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  constructor(){
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {

    localStorage.removeItem('registroDesdeGoogle');

    // @ts-ignore
    google.accounts.id.initialize({
      // client_id: `${environment.googleClientId}`,
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleCredentialResponse(response),
    });

    const googleButton = document.getElementById('google-signin-button');
    if (googleButton) {
      // @ts-ignore
      google.accounts.id.renderButton(
        googleButton,
        { type: 'standard', theme: 'outline', size: 'large' }
      );
    }
  }

  controlHasError(control: string, error: string){
    return this.loginForm.controls[control].hasError(error);
  }

  onsubmit(){
    if(this.loginForm.invalid){
      return;
    };

    const credentials: AuthRequest = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.showSnackBar('Inicio de sesión exitoso');
        // @RequestMapping("/developers") de la Clase DeveloperController
        this.router.navigate(['/']);
      },
      error: () => {
        this.showSnackBar('Error en el inicio de sesión. Por favor, intenta de nuevo.');
      },
    });
  }

  handleCredentialResponse(response: any): void {
    const idToken = response.credential;

    this.authService.loginWithGoogle(idToken).subscribe({
      next: (res: any) => {
        if (res.token) {
          localStorage.setItem("edurents_auth", JSON.stringify(res));
          this.showSnackBar('Inicio de sesión exitoso');
          this.router.navigate(['/']);
        } else if (res.usuarioNoRegistrado) {

          const datos = {
            nombre: res.nombre,
            correo: res.correo
          };
        
          // Guardar en localStorage por si el usuario recarga la página
          localStorage.setItem('registroDesdeGoogle', JSON.stringify(datos));

          this.showSnackBar('Usuario no registrado. Por favor, completa el registro.');

          this.router.navigate(['/auth/register'], {
            state: datos
          });
        }
      },
      error: () => {
        this.showSnackBar('Error autenticando con Google');
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
