import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaccion-cancelada',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaccion-cancelada.component.html',
  styleUrls: ['./transaccion-cancelada.component.css']
})
export class TransaccionCanceladaComponent {
  constructor(private router: Router) {}

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }
}
