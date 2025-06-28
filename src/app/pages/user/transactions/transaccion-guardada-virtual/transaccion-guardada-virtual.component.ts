import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaccion-guardada-virtual',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaccion-guardada-virtual.component.html',
  styleUrls: ['./transaccion-guardada-virtual.component.css']
})
export class TransaccionGuardadaVirtualComponent implements OnInit {
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

  irHistorial(): void {
    this.router.navigate(['/historial-pagos'], {
      queryParams: { estado: 'PENDIENTE' }
    });
  }

  cancelarTransaccion(): void {
    this.router.navigate(['/transaccion-cancelada']);
  }

  reclamarEntrega(): void {
    this.router.navigate(['/reclamar-entrega'], {
      queryParams: { tipo: 'virtual' }
    });
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}
