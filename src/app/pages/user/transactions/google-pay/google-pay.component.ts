import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";
import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { TransactionService } from '../../../../core/services/transaction.service';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-google-pay',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './google-pay.component.html',
  styleUrls: ['./google-pay.component.css']
})
export class GooglePayComponent implements OnInit {
  googleForm: FormGroup;
  idTransaccion!: number;

  private authService = inject(AuthService);
  private location = inject(Location);
  private transactionService = inject(TransactionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor(private fb: FormBuilder) {
    this.googleForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email, Validators.pattern('^[\\w.+\\-]+@gmail\\.com$')]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idTransaccion = +params['idTransaccion'];
    });
  }

  submit(): void {
    if (this.googleForm.valid) {
      const user = this.authService.getUser();
      const token = user?.token;

      // const transaccion = {
      //   idTransaccion: this.idTransaccion,
      //   metodoPago: 'GOOGLEPAY'
      // };

      // if (token) {
      //   this.transactionService.crearTransaccion(transaccion, token).subscribe((nueva) => {
      //     localStorage.removeItem('idProducto');
      //     this.router.navigate(['/transaccion-guardada-virtual'], {
      //       queryParams: {
      //         metodo: 'GOOGLEPAY',
      //         idTransaccion: nueva.id
      //       }
      //     });
      //   });
      // }

      console.log('Procesando pago para transacción:', this.idTransaccion);
      this.router.navigate(['/transaccion-guardada-virtual'], {
        queryParams: {
          metodo: 'GOOGLEPAY',
          idTransaccion: this.idTransaccion
        }
      });
    }
  }

  volver(): void {
    this.location.back();
  }
}
