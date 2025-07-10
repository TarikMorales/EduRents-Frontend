import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialPagosComponent } from '../transactions/historial-pagos/historial-pagos.component';
import { HistorialIntercambiosComponent } from '../exchange-offer/historial-intercambios/historial-intercambios.component';
import { Router } from '@angular/router';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-historial-general',
  standalone: true,
  imports: [CommonModule, HistorialPagosComponent, HistorialIntercambiosComponent, NavbarComponent, FooterComponent, MatSnackBarModule],
  templateUrl: './historial-general.component.html',
  styleUrls: ['./historial-general.component.css']
})
export class HistorialGeneralComponent implements OnInit {

  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.showSnackBar('Por favor, inicia sesión para acceder a esta sección.');
      this.router.navigate(['/auth/login']);
      return;
    }
  }

  constructor(private router: Router) {}

  cambiarAVistaVendedor(): void {
    this.router.navigate(['/seller/historial']);
  }

  private showSnackBar(message: string): void{
    this.snackBar.open(message, 'Close',{
      duration: 2000,
      verticalPosition: 'top'
    })
  }
  
}
