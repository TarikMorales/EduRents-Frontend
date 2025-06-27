import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaccion-efectivo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaccion-efectivo.component.html',
  styleUrls: ['./transaccion-efectivo.component.css']
})
export class TransaccionEfectivoComponent implements OnInit {
  motivoReclamo: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.motivoReclamo = params['reclamo'] || null;
    });
  }

  confirmarPago(): void {
    this.router.navigate(['/pago-confirmado']);
  }

  irAConfirmarPagos(): void {
    this.router.navigate(['/historial-pagos'], {
      queryParams: { estado: 'PENDIENTE' }
    });
  }

  cancelarTransaccion(): void {
    this.router.navigate(['/transaccion-cancelada']);
  }

  reclamarEntrega(): void {
    this.router.navigate(['/reclamar-entrega'], {
      queryParams: { tipo: 'efectivo' }
    });
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}
