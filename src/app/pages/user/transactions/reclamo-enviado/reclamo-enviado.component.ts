import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";

@Component({
  selector: 'app-reclamo-enviado',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
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
    this.router.navigate(['/mi-historial']);
  }
}
