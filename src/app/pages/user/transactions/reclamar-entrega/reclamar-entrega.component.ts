import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";
import { AuthService } from '../../../../core/services/auth.service';
import { TransactionService } from '../../../../core/services/transaction.service';
import { Reclamo } from '../../../../shared/model/transaction/reclamo.model';
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
  idTransaccion: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private authService: AuthService
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
      this.idTransaccion = params['idTransaccion'] || null;
      if (!this.idTransaccion) {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  volver(): void {
    this.tipoTransaccion === 'efectivo'
      ? this.router.navigate(['/transaccion-efectivo'])
      : this.router.navigate(['/transaccion-guardada-virtual']);
  }

  enviarReclamo(): void {
    if (this.reclamoForm.valid) {
      const motivo = this.reclamoForm.value.motivo;
      const user = this.authService.getUser();

      if (!user || !this.idTransaccion) {
        this.router.navigate(['/auth/login']);
        return;
      }

      const reclamo: Reclamo = {
        motivo_reclamo: motivo,
      };

      this.transactionService.reclamarTransaccion(Number(this.idTransaccion), reclamo, user.token).subscribe({
        next: () => {
          this.router.navigate(['/reclamo-enviado'], {
            queryParams: { tipo: this.tipoTransaccion, motivo: reclamo.motivo_reclamo }
          });
        },
        error: () => {
          alert('Error al enviar el reclamo.');
        }
      });
    }
  }
}
