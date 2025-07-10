import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerTransactionService } from '../../../../core/services/seller-transaction.service';
import { TransactionDTO } from '../../../../shared/model/transaction/transaction.model';
import { AuthService } from '../../../../core/services/auth.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";

@Component({
  selector: 'app-seller-historial-pagos',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  providers: [DatePipe],
  templateUrl: './seller-historial-pagos.component.html',
  styleUrls: ['./seller-historial-pagos.component.css']
})
export class SellerHistorialPagosComponent implements OnInit {
  transacciones: TransactionDTO[] = [];
  idVendedor: number | null = null;

  constructor(
    private sellerTransactionService: SellerTransactionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.idVendedor = user.id;
      this.obtenerTransacciones();
    }
  }

  obtenerTransacciones(): void {
    if (!this.idVendedor) return;

    this.sellerTransactionService.getTransactionsBySeller(this.idVendedor)
      .subscribe(data => {
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
