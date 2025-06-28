import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialPagosComponent } from '../transactions/historial-pagos/historial-pagos.component';
import { HistorialIntercambiosComponent } from '../exchange-offer/historial-intercambios/historial-intercambios.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-historial-general',
  standalone: true,
  imports: [CommonModule, HistorialPagosComponent, HistorialIntercambiosComponent],
  templateUrl: './historial-general.component.html',
  styleUrls: ['./historial-general.component.css']
})
export class HistorialGeneralComponent {

  constructor(private router: Router) {}

  cambiarAVistaVendedor(): void {
    this.router.navigate(['/seller/historial']);
  }
  
}
