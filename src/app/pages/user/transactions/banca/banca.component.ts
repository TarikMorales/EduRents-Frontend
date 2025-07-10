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
  selector: 'app-banca',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './banca.component.html',
  styleUrls: ['./banca.component.css']
})
export class BancaComponent implements OnInit {
  bancaForm: FormGroup;
  bancos: string[] = ['BCP', 'Interbank', 'BBVA', 'Scotiabank', 'BanBif'];
  idTransaccion!: number;

  private authService = inject(AuthService);
  private transactionService = inject(TransactionService);
  private location = inject(Location);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor(private fb: FormBuilder) {
    this.bancaForm = this.fb.group({
      banco: ['', Validators.required],
      numeroCuenta: ['', [Validators.required, Validators.pattern(/^\d{10,20}$/)]],
      titular: ['', Validators.required],
      aceptaTerminos: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idTransaccion = +params['idTransaccion'];
    });
  }

  submit(): void {
    if (this.bancaForm.valid) {
      const user = this.authService.getUser();
      const token = user?.token;

      // const transaccion = {
      //   idTransaccion: this.idTransaccion,
      //   metodoPago: 'BANCA'
      // };

      // if (token) {
      //   this.transactionService.crearTransaccion(transaccion, token).subscribe((nueva) => {
      //     localStorage.removeItem('idProducto');
      //     this.router.navigate(['/transaccion-guardada-virtual'], {
      //       queryParams: {
      //         metodo: 'BANCA',
      //         idTransaccion: nueva.id
      //       }
      //     });
      //   });
      // }

      console.log('Procesando pago para transacción:', this.idTransaccion);
      this.router.navigate(['/transaccion-guardada-virtual'], {
        queryParams: {
          metodo: 'BANCA',
          idTransaccion: this.idTransaccion
        }
      });
    }
  }

  volver(): void {
    this.location.back();
  }
}
