import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { AuthResponse } from '../../../shared/model/login/auth-response.model';
import { SellerRequest } from '../../../shared/model/profile/seller-request.model';

@Component({
  selector: 'app-make-seller',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, ReactiveFormsModule, MatSnackBarModule, RouterLink],
  templateUrl: './make-seller.component.html',
  styleUrl: './make-seller.component.css'
})
export class MakeSellerComponent implements OnInit {

  sellerForm: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  idUsuario: number = 0;

  constructor() {
    this.sellerForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      nombreNegocio: ['', [Validators.required]],
      presentacion: ['', [Validators.required]],
      numeroTelefono: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.authService.getUser()?.rol === 'SELLER') {
      this.showSnackBar('Ya eres un vendedor');
      this.router.navigate(['/user']);
      return;
    }

    const user : AuthResponse = this.authService.getUser()!;

    this.sellerForm.patchValue({
      correo: user.correo,
    });

    this.idUsuario = user.id;

  }

  onSubmit(){
    if(this.sellerForm.invalid){
      return;
    };

    const sellerData : SellerRequest = this.sellerForm.value;

    this.userService.makeSeller(this.idUsuario, sellerData, this.authService.getUser()?.token!).subscribe({
      next: () => {
        this.showSnackBar('¡Ahora eres un vendedor! Inicia sesión para continuar.');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.showSnackBar('Error al convertir en vendedor. Inténtalo de nuevo más tarde.');
        this.router.navigate(['/user']);
      }
    });

  }

  controlHasError(control: string, error: string){
    return this.sellerForm.controls[control].hasError(error);
  }

  private showSnackBar(message: string): void{
    this.snackBar.open(message, 'Close',{
      duration: 2000,
      verticalPosition: 'top'
    })
  }


}
