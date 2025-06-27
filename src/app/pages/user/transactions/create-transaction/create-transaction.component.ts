import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-transaction.component.html',
  styleUrl: './create-transaction.component.css'
})
export class CreateTransactionComponent {
  transactionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.transactionForm = this.fb.group({
      idProducto: ['', [Validators.required]],
      metodoPago: ['EFECTIVO', [Validators.required]]
    });
  }

  submitTransaction() {
    if (this.transactionForm.valid) {
      const payload = this.transactionForm.value;
      console.log('Enviando transacción:', payload);
      // Lógica para enviar la transacción
    }
  }

  selectPayment(metodo: string) {
  this.transactionForm.get('metodoPago')?.setValue(metodo);
  }

}
