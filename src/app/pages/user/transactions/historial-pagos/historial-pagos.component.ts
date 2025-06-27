import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../../../core/services/transaction.service';
import { TransactionDTO } from '../../../../shared/model/transaction/transaction.model';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para ngModel y select
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-historial-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // ¡Importante!
  providers: [DatePipe], // Para usar el pipe date
  templateUrl: './historial-pagos.component.html',
  styleUrls: ['./historial-pagos.component.css']
})
export class HistorialPagosComponent implements OnInit {
  transacciones: TransactionDTO[] = [];
  filtroMetodoPago: string = '';
  filtroEstado: string = '';
  idUsuario: number | null = null;

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  const user = this.authService.getUser();
  if (user) {
    this.idUsuario = user.id;

    this.route.queryParams.subscribe(params => {
      if (params['estado']) this.filtroEstado = params['estado'];
      if (params['metodo']) this.filtroMetodoPago = params['metodo'];
      this.filtrar();
    });
  }}

  filtrar(): void {
    if (!this.idUsuario) return;

    this.transactionService.getTransactionsByUser(this.idUsuario!, this.filtroEstado, this.filtroMetodoPago)
      .subscribe(data => {
        this.transacciones = data;
      });
  }

  confirmar(id: number) {
    this.transactionService.confirmarTransaccion(id).subscribe(() => this.filtrar());
  }

  cancelar(id: number) {
    this.transactionService.cancelarTransaccion(id).subscribe(() => this.filtrar());
  }

  reclamar(id: number) {
    const motivo = prompt('Escribe el motivo del reclamo:');
    if (motivo) {
      this.transactionService.reclamarTransaccion(id, motivo).subscribe(() => this.filtrar());
    }
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