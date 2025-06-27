import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reclamo-enviado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reclamo-enviado.component.html',
  styleUrls: ['./reclamo-enviado.component.css']
})
export class ReclamoEnviadoComponent implements OnInit {
  tipo: 'efectivo' | 'virtual' = 'virtual';
  motivo: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['tipo'] === 'efectivo') {
        this.tipo = 'efectivo';
      }
      this.motivo = params['motivo'] || '';
    });
  }

  volverATransaccion(): void {
    if (this.tipo === 'efectivo') {
      this.router.navigate(['/transaccion-efectivo'], {
        queryParams: { reclamo: this.motivo }
      });
    } else {
      this.router.navigate(['/transaccion-guardada-virtual'], {
        queryParams: { reclamo: this.motivo }
      });
    }
  }
}