import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";
import { AuthService } from '../../../../core/services/auth.service';
import { TransactionService } from '../../../../core/services/transaction.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-transaccion-efectivo',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './transaccion-efectivo.component.html',
  styleUrls: ['./transaccion-efectivo.component.css']
})
export class TransaccionEfectivoComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  idTransaccion!: number;
  metodoPago!: string;
  token!: string;
  motivoReclamo: string | null = null;

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const idProducto = Number(this.route.snapshot.queryParamMap.get('idProducto'));
    this.token = user.token;

    if (!idProducto) {
      alert('No se pudo identificar el producto.');
      this.router.navigate(['/']);
      return;
    }

    this.transactionService.getTransactionByUserAndProduct(user.id, idProducto, this.token).subscribe({
      next: (transaccion) => {
        this.idTransaccion = transaccion.id;
        this.metodoPago = transaccion.metodo_pago;
      },
      error: () => {
        alert('No se pudo obtener la transacción');
        this.router.navigate(['/']);
      }
    });

    this.route.queryParams.subscribe(params => {
      this.motivoReclamo = params['reclamo'] || null;
    });
  }

  confirmarPago(): void {
    if (this.idTransaccion && this.token) {
      this.transactionService.confirmarTransaccion(this.idTransaccion, this.token).subscribe({
        next: () => this.router.navigate(['/pago-confirmado']),
        error: () => alert('Error al confirmar la transacción')
      });
    }
  }

  irAConfirmarPagos(): void {
    this.router.navigate(['/mi-historial']);
  }

  cancelarPago(): void {
    if (this.idTransaccion && this.token) {
      this.transactionService.cancelarTransaccion(this.idTransaccion, this.token).subscribe({
        next: () => this.router.navigate(['/transaccion-cancelada']),
        error: () => alert('Error al cancelar la transacción')
      });
    }
  }

  reclamarEntrega(): void {
    this.router.navigate(['/reclamar-entrega'], {
      queryParams: {
        tipo: this.metodoPago === 'EFECTIVO' ? 'efectivo' : 'virtual',
        idTransaccion: this.idTransaccion
      }
    });
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}
