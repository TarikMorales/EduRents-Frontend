import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeOfferResponse } from '../../../../shared/model/exchange-offer/exchange-offer.model';
import { AuthService } from '../../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { SellerExchangeOfferService } from '../../../../core/services/seller-exchange-offer.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-seller-historial-intercambios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './seller-historial-intercambios.component.html',
  styleUrls: ['./seller-historial-intercambios.component.css'],
  providers: [DatePipe]
})
export class SellerHistorialIntercambiosComponent implements OnInit {
  ofertas: ExchangeOfferResponse[] = [];
  idVendedor: number | null = null;

  constructor(
    private sellerExchangeOfferService: SellerExchangeOfferService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.idVendedor = user.id;
      this.cargarOfertas();
    }
  }

  cargarOfertas(): void {
    if (!this.idVendedor) return;

    this.sellerExchangeOfferService.getOffersToSeller(this.idVendedor)
      .subscribe(data => {
        this.ofertas = data;
      });
  }

  aceptar(id: number): void {
    this.sellerExchangeOfferService.aceptarOferta(id).subscribe(() => this.cargarOfertas());
  }

  rechazar(id: number): void {
    this.sellerExchangeOfferService.rechazarOferta(id).subscribe(() => this.cargarOfertas());
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'text-warning';
      case 'ACEPTADA': return 'text-success';
      case 'RECHAZADA': return 'text-danger';
      case 'CANCELADA': return 'text-secondary';
      default: return '';
    }
  }
}
