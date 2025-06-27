import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banca',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './banca.component.html',
  styleUrls: ['./banca.component.css']
})
export class BancaComponent {
  bancaForm: FormGroup;
  bancos: string[] = ['BCP', 'Interbank', 'BBVA', 'Scotiabank', 'BanBif'];

  constructor(private fb: FormBuilder, private router: Router) {
    this.bancaForm = this.fb.group({
      banco: ['', Validators.required],
      numeroCuenta: ['', [Validators.required, Validators.pattern(/^\d{10,20}$/)]],
      titular: ['', Validators.required],
      aceptaTerminos: [false, Validators.requiredTrue]
    });
  }

  submit(): void {
    if (this.bancaForm.valid) {
      console.log('Pago vía banca:', this.bancaForm.value);
      this.router.navigate(['/transaccion-guardada-virtual'], {
        queryParams: { metodo: 'BANCA' }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/create-transaction']);
  }
}
