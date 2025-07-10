import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ExchangeOfferResponse } from '../../../../shared/model/exchange-offer/exchange-offer.model';
import { AuthService } from '../../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { ExchangeOfferService } from '../../../../core/services/exchange-offer.service';

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
  token: string = '';

  constructor(
    private exchangeOfferService: ExchangeOfferService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.idVendedor = user.id;
      this.token = user.token;
      this.cargarOfertas();
    }
  }

  cargarOfertas(): void {
    if (!this.idVendedor || !this.token) return;

    this.exchangeOfferService.getOfertasPorVendedor(this.idVendedor, this.token)
      .subscribe(data => {
        this.ofertas = data;
      });
  }

  aceptar(id: number): void {
    if (!this.idVendedor || !this.token) return;

    this.exchangeOfferService.responderOferta(id, this.idVendedor, true, this.token)
      .subscribe(() => this.cargarOfertas());
  }

  rechazar(id: number): void {
    if (!this.idVendedor || !this.token) return;

    this.exchangeOfferService.responderOferta(id, this.idVendedor, false, this.token)
      .subscribe(() => this.cargarOfertas());
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'text-warning';
      case 'ACEPTADO': return 'text-success';
      case 'RECHAZADO': return 'text-danger';
      default: return '';
    }
  }
}
