import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerHistorialPagosComponent } from '../../seller/transactions/seller-historial-pagos/seller-historial-pagos.component';
import { SellerHistorialIntercambiosComponent } from '../exchange-offers/seller-historial-intercambios/seller-historial-intercambios.component';
import { Router } from '@angular/router';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-seller-historial-general',
  standalone: true,
  imports: [CommonModule, SellerHistorialPagosComponent, SellerHistorialIntercambiosComponent, NavbarComponent, FooterComponent, MatSnackBarModule],
  templateUrl: './seller-historial-general.component.html',
  styleUrls: ['./seller-historial-general.component.css']
})
export class SellerHistorialGeneralComponent implements OnInit {

  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.showSnackBar('Por favor, inicia sesión para acceder a esta sección.');
      this.router.navigate(['/auth/login']);
      return;
    }

    const user = this.authService.getUser();
    if (!user || user.rol === 'USER') {
      this.showSnackBar('No tienes permisos para acceder a esta sección.');
      this.router.navigate(['/mi-historial']);
      return;
    }

  }

  constructor(private router: Router) {}

  cambiarAVistaUsuario(): void {
    this.router.navigate(['mi-historial']);
  }

  private showSnackBar(message: string): void{
    this.snackBar.open(message, 'Close',{
      duration: 2000,
      verticalPosition: 'top'
    })
  }

}
