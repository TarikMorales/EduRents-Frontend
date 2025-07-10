import { Reclamo } from './../../../../shared/model/transaction/reclamo.model';
import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../../../core/services/transaction.service';
import { TransactionDTO } from '../../../../shared/model/transaction/transaction.model';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para ngModel y select
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  providers: [DatePipe],
  templateUrl: './historial-pagos.component.html',
  styleUrls: ['./historial-pagos.component.css']
})
export class HistorialPagosComponent implements OnInit {
  transacciones: TransactionDTO[] = [];
  filtroMetodoPago: string = '';
  filtroEstado: string = '';
  idUsuario: number | null = null;
  token: string = '';

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.idUsuario = user.id;
      this.token = user.token;

      this.route.queryParams.subscribe(params => {
        if (params['estado']) this.filtroEstado = params['estado'];
        if (params['metodo']) this.filtroMetodoPago = params['metodo'];
        this.filtrar();
      });

      this.filtrar(); // importante
    }
  }

  filtrar(): void {
    if (!this.idUsuario) return;

    this.transactionService
      .getTransactionsByUser(this.idUsuario, this.token, this.filtroEstado, this.filtroMetodoPago)
      .subscribe({
        next: (data) => this.transacciones = data,
        complete: () => console.log(this.transacciones),
        error: (err) => console.error('Error al filtrar transacciones:', err)
      });
  }

  confirmar(idTransaccion: number, idProducto: number): void {
    if (!this.token) return;
    this.transactionService.confirmarTransaccion(idTransaccion, this.token).subscribe(() => {
      this.transactionService.actualizarStockProducto(idProducto, this.token).subscribe();
      this.filtrar();
    });
  }

  cancelar(id: number): void {
    if (!this.token) return;
    this.transactionService.cancelarTransaccion(id, this.token).subscribe(() => this.filtrar());
  }

  reclamar(id: number): void {
    if (!this.token) return;
    const motivo = prompt('Escribe el motivo del reclamo:');
    const motivo_reclamo : Reclamo = { motivo_reclamo: motivo || '' };
    if (motivo) {
      this.transactionService.reclamarTransaccion(id, motivo_reclamo, this.token).subscribe(() => this.filtrar());
    }
  }

  verDetalle(transaccion: TransactionDTO): void {
    if (!transaccion || !transaccion.id || !transaccion.metodo_pago || !this.idUsuario) {
      console.warn('Transacción inválida al intentar ver detalle.');
      return;
    }

    const ruta = transaccion.metodo_pago === 'EFECTIVO'
      ? '/transaccion-efectivo'
      : '/transaccion-guardada-virtual';

    this.router.navigate([ruta], {
      queryParams: {
        idTransaccion: transaccion.id,
        idUsuario: this.idUsuario
      }
    });
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'text-warning';
      case 'CONFIRMADA': return 'text-success';
      case 'CANCELADA': return 'text-danger';
      case 'RECLAMADA': return 'text-info';
      default: return '';
    }
  }
}
