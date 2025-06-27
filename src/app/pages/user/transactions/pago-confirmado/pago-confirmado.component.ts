import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pago-confirmado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago-confirmado.component.html',
  styleUrls: ['./pago-confirmado.component.css']
})
export class PagoConfirmadoComponent {
  constructor(private router: Router) {}

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }
}
