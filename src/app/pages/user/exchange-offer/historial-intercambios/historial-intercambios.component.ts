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
  ofertas: ExchangeOfferResponse[] = [];
  idUsuario: number | null = null;
  token: string = '';

  constructor(
    private exchangeService: ExchangeOfferService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.idUsuario = user.id;
      this.token = user.token;
      this.cargarOfertas();
    }


  }

  cargarOfertas(): void {
    if (!this.idUsuario || !this.token) return;
    this.exchangeService.getOfertasPorUsuario(this.idUsuario, this.token).subscribe({
      next: (data) => this.ofertas = data,
      error: () => this.ofertas = []
    });
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'text-warning';
      case 'ACEPTADA': return 'text-success';
      case 'RECHAZADO': return 'text-danger';
      default: return '';
    }
  }
}
