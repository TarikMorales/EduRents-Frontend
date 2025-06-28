import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.css']
})
export class CreateTransactionComponent {
  transactionForm: FormGroup;
  selectedMetodo: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.transactionForm = this.fb.group({
      idProducto: ['1', Validators.required],
      metodoPago: [null, Validators.required]
    });
  }

  selectMetodo(metodo: string): void {
    this.selectedMetodo = metodo;
    this.transactionForm.patchValue({ metodoPago: metodo });
  }

  submitTransaction(): void {
    if (this.transactionForm.valid) {
      const metodo = this.transactionForm.value.metodoPago;

      switch (metodo) {
        case 'EFECTIVO':
          this.router.navigate(['/transaccion-efectivo']);
          break;
        case 'TARJETA':
          this.router.navigate(['/pago-tarjeta']);
          break;
        case 'GOOGLEPAY':
          this.router.navigate(['/pago/google-pay']);
          break;
        case 'APPLEPAY':
          this.router.navigate(['/pago/apple-pay']);
          break;
        case 'BANCA':
          this.router.navigate(['/pago/banca']);
          break;
        default:
          console.warn('Método de pago no reconocido');
      }
    } else {
      console.warn('Formulario inválido');
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
