// src/app/pages/user/exchanges/historial-intercambios/historial-intercambios.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ExchangeOfferService } from '../../../../core/services/exchange-offer.service';
import { ExchangeOfferResponse } from '../../../../shared/model/exchange-offer/exchange-offer.model';

@Component({
  selector: 'app-historial-intercambios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [DatePipe],
  templateUrl: './historial-intercambios.component.html',
  styleUrls: ['./historial-intercambios.component.css']
})
export class HistorialIntercambiosComponent implements OnInit {
  intercambios: ExchangeOfferResponse[] = [];
  idUsuario: number | null = null;

  constructor(
    private authService: AuthService,
    private exchangeService: ExchangeOfferService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.idUsuario = user.id;
      this.cargarIntercambios();
    }
  }

  cargarIntercambios(): void {
    if (!this.idUsuario) return;

    this.exchangeService.getOffersByUser(this.idUsuario!)
      .subscribe(data => {
        this.intercambios = data;
      });
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
