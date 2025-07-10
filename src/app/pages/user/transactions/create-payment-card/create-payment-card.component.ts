// create-payment-card.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../../core/services/transaction.service';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";
import { AuthService } from '../../../../core/services/auth.service';
import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-create-payment-card',
  standalone: true,
  templateUrl: './create-payment-card.component.html',
  styleUrls: ['./create-payment-card.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NavbarComponent, FooterComponent]
})
export class CreatePaymentCardComponent implements OnInit {
  paymentForm: FormGroup;
  idTransaccion!: number;
  private authService = inject(AuthService);
  private location = inject(Location);
  private route = inject(ActivatedRoute);

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

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idTransaccion = +params['idTransaccion'];
    });
  }

  submitPayment(): void {
    if (this.paymentForm.valid) {
      const user = this.authService.getUser();
      const token = user?.token;

      const transaccion = {
        idTransaccion: this.idTransaccion,
        metodoPago: 'TARJETA'
      };

      localStorage.removeItem('idProducto');

      // if (token) {
      //   this.transactionService.crearTransaccion(transaccion, token).subscribe((nueva) => {
      //     localStorage.removeItem('idProducto');
      //     this.router.navigate(['/transaccion-guardada-virtual'], {
      //       queryParams: {
      //         metodo: 'TARJETA',
      //         idTransaccion: nueva.id
      //       }
      //     });
      //   });
      // }

      console.log('Procesando pago para transacción:', this.idTransaccion);

      this.router.navigate(['/transaccion-guardada-virtual'], {
        queryParams: {
          metodo: 'TARJETA',
          idTransaccion: this.idTransaccion
        }
      });

    }
  }

  goBack(): void {
    this.location.back();
  }
}
