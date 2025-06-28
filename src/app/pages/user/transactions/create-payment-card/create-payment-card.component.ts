// create-payment-card.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../../core/services/transaction.service';

@Component({
  selector: 'app-create-payment-card',
  standalone: true,
  templateUrl: './create-payment-card.component.html',
  styleUrls: ['./create-payment-card.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink]
})
export class CreatePaymentCardComponent {
  paymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private transactionService: TransactionService
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvc: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      fullName: ['', Validators.required],
      country: ['Perú', Validators.required],
      postalCode: ['', Validators.required]
    });
  }

  submitPayment(): void {
    if (this.paymentForm.valid) {
      const transaccion = {
        idProducto: 1,
        metodoPago: 'TARJETA'
      };

      this.transactionService.crearTransaccion(transaccion).subscribe(() => {
        this.router.navigate(['/transaccion-guardada-virtual']);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/create-transaction']);
  }
}
