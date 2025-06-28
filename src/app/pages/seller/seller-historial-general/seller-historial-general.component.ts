import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerHistorialPagosComponent } from '../../seller/transactions/seller-historial-pagos/seller-historial-pagos.component';
import { SellerHistorialIntercambiosComponent } from '../exchange-offers/seller-historial-intercambios/seller-historial-intercambios.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-seller-historial-general',
  standalone: true,
  imports: [CommonModule, SellerHistorialPagosComponent, SellerHistorialIntercambiosComponent],
  templateUrl: './seller-historial-general.component.html',
  styleUrls: ['./seller-historial-general.component.css']
})
export class SellerHistorialGeneralComponent {

  constructor(private router: Router) {}

  cambiarAVistaUsuario(): void {
    this.router.navigate(['mi-historial']);
  }

}
