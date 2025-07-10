import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../../core/services/transaction.service';
import { TransactionDTO } from '../../../../shared/model/transaction/transaction.model';
import { AuthService } from '../../../../core/services/auth.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-seller-historial-pagos',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, FormsModule],
  providers: [DatePipe],
  templateUrl: './seller-historial-pagos.component.html',
  styleUrls: ['./seller-historial-pagos.component.css']
})
export class SellerHistorialPagosComponent implements OnInit {
  transacciones: TransactionDTO[] = [];
  idVendedor: number | null = null;
  token: string = '';
  filtroMetodoPago: string = '';
  filtroEstado: string = '';

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.idVendedor = user.id;
      this.token = user.token;

      this.route.queryParams.subscribe(params => {
        if (params['estado']) this.filtroEstado = params['estado'];
        if (params['metodo']) this.filtroMetodoPago = params['metodo'];
        this.filtrar();
      });

      this.filtrar();
    }
  }

  filtrar(): void {
    if (!this.idVendedor || !this.token) return;

    this.transactionService.getTransactionsBySeller(
      this.idVendedor,
      this.token,
      this.filtroEstado,
      this.filtroMetodoPago
    ).subscribe(data => {
      this.transacciones = data;
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