import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";

@Component({
  selector: 'app-reclamar-entrega',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './reclamar-entrega.component.html',
  styleUrls: ['./reclamar-entrega.component.css']
})
export class ReclamarEntregaComponent implements OnInit {
  reclamoForm: FormGroup;
  tipoTransaccion: 'efectivo' | 'virtual' = 'virtual';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.reclamoForm = this.fb.group({
      motivo: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tipo = params['tipo'];
      if (tipo === 'efectivo' || tipo === 'virtual') {
        this.tipoTransaccion = tipo;
      }
    });
  }

  enviarReclamo(): void {
    if (this.reclamoForm.valid) {
      const motivo = this.reclamoForm.value.motivo;
      console.log('Reclamo enviado:', motivo);
      // Puedes almacenar el reclamo en una variable de estado o servicio si lo necesitas luego
      this.router.navigate(['/reclamo-enviado'], {
        queryParams: { tipo: this.tipoTransaccion, motivo }
      });
    }
  }

  volver(): void {
    this.tipoTransaccion === 'efectivo'
      ? this.router.navigate(['/transaccion-efectivo'])
      : this.router.navigate(['/transaccion-guardada-virtual']);
  }
}
