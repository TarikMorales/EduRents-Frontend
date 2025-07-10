import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";

@Component({
  selector: 'app-transaccion-efectivo',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
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
    this.router.navigate(['/mi-historial']);
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
