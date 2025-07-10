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
  productoID!: number;
  metodoPago!: string;
  token!: string;
  motivoReclamo: string | null = null;
  haHechoReclamo: boolean = false;
  haConfirmadoPago: boolean = false;

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }
    let idTransaccion: number | undefined;


    idTransaccion = Number(this.route.snapshot.queryParamMap.get('idTransaccion'));
    this.token = user.token;

    if (idTransaccion) {

      this.transactionService.getTransactionByIdAndUser(idTransaccion, user.id, this.token).subscribe({
        next: (transaccion) => {
          this.idTransaccion = transaccion.id;
          this.metodoPago = transaccion.metodo_pago;
          this.motivoReclamo = transaccion.motivo_reclamo ? transaccion.motivo_reclamo : null;
          this.productoID = transaccion.producto.id;
          if (transaccion.motivo_reclamo && transaccion.motivo_reclamo.trim() !== '') {
            this.haHechoReclamo = true;
          }
          if (transaccion.estado === 'PAGADO' || transaccion.estado === 'CANCELADO') {
            this.haConfirmadoPago = true;
          }
        },
        error: () => {
          alert('No se pudo obtener la transacción');
          this.router.navigate(['/']);
        }
      });
    }

    this.route.queryParams.subscribe(params => {
      this.motivoReclamo = params['reclamo'] || null;
    });
  }

  confirmarPago(): void {
    if (this.idTransaccion && this.token) {
      this.transactionService.confirmarTransaccion(this.idTransaccion, this.token).subscribe({
        next: () => {
          this.transactionService.actualizarStockProducto(this.productoID, this.token).subscribe({
            next: () => console.log('Pago confirmado y stock actualizado'),
            error: () => console.error('Error al actualizar el stock del producto')
          });
          this.router.navigate(['/pago-confirmado'])
        },
        error: () => console.error('Error al confirmar la transacción')
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
    this.router.navigate(['/mi-historial']);
  }
}
