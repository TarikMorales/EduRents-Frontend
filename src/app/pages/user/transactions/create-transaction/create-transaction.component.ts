import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";
import { AuthService } from '../../../../core/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Product } from '../../../../shared/model/product-filter/product/producto';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailService } from '../../../../core/services/product-detail.service';
import { TransactionService } from '../../../../core/services/transaction.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NavbarComponent, FooterComponent, MatSnackBarModule],
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.css']
})
export class CreateTransactionComponent implements OnInit {
  transactionForm: FormGroup;
  selectedMetodo: string | null = null;
  product?: Product;
  idUsuario: number | null = null;
  token: string = '';
  errorTransaccionExistente = false;

  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private location = inject(Location);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductDetailService,
    private transactionService: TransactionService
  ) {
    this.transactionForm = this.fb.group({
      idProducto: ['', Validators.required],
      metodoPago: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const user = this.authService.getUser();

    if (!user) {
      this.showSnackBar('Debes iniciar sesión para continuar con la transacción.');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.idUsuario = user.id;
    this.token = user.token;

    this.route.queryParams.subscribe(params => {
      const idProductoRaw = params['idProducto'];

      if (!idProductoRaw || isNaN(+idProductoRaw)) {
        this.showSnackBar('No se pudo identificar el producto.');
        return;
      }

      const idProducto = +idProductoRaw;

      // ⚠️ Cargar primero en el form para evitar errores de undefined
      this.transactionForm.patchValue({ idProducto });

      this.cargarProducto(idProducto);
      this.verificarTransaccionExistente(idProducto, this.idUsuario!, this.token);
    });
  }

  cargarProducto(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: data => this.product = data,
      error: () => this.showSnackBar('Error al cargar el producto.')
    });
  }

  verificarTransaccionExistente(idProducto: number, idUsuario: number, token: string): void {
    this.transactionService.getTransactionByUserAndProduct(idUsuario, idProducto, token).subscribe({
      next: () => {
        this.errorTransaccionExistente = true;
        this.showSnackBar('Ya realizaste una transacción sobre este producto.');
      },
      error: (err) => {
        if (err.status === 404) {
          this.errorTransaccionExistente = false;
        } else {
          this.showSnackBar('Error al verificar transacción existente.');
          this.errorTransaccionExistente = true;
        }
      }
    });
  }

  selectMetodo(metodo: string): void {
    this.selectedMetodo = metodo;
    this.transactionForm.patchValue({ metodoPago: metodo });
  }

  submitTransaction(): void {
    if (this.errorTransaccionExistente) {
      this.showSnackBar('Ya realizaste una transacción sobre este producto.');
      return;
    }

    if (!this.product) {
      this.showSnackBar('El producto aún no se ha cargado correctamente.');
      return;
    }

    if (this.transactionForm.valid && this.idUsuario) {
      const metodo = this.transactionForm.value.metodoPago;
      const idProducto = this.transactionForm.value.idProducto;

      const payload = {
        id_usuario: this.idUsuario,
        id_producto: idProducto,
        metodo_pago: metodo
      };

      console.log('Payload enviado:', payload);
      console.log('Token enviado:', this.token);

      this.transactionService.crearTransaccion(payload, this.token).subscribe({
        next: (response) => {
          this.showSnackBar('Transacción creada exitosamente');

          if (metodo === 'EFECTIVO') {
            this.router.navigate(['/transaccion-efectivo'], {
              queryParams: { idProducto: idProducto }
            });
          } else {

            switch (metodo) {
              case 'TARJETA':
                this.router.navigate(['/pago-tarjeta'], {
                  queryParams: { idTransaccion: response.id }
                });
                break;
              case 'BANCA':
                this.router.navigate(['/pago/banca'], {
                  queryParams: { idTransaccion: response.id }
                });
                break;
              case 'GOOGLEPAY':
                this.router.navigate(['/pago/google-pay'], {
                  queryParams: { idTransaccion: response.id }
                });
                break;
              case 'APPLEPAY':
                this.router.navigate(['/pago/apple-pay'], {
                  queryParams: { idTransaccion: response.id }
                });
                break;
              default:
                this.showSnackBar('Método de pago no reconocido');
            }
          }
        },
        error: (err) => {
          console.error('Error al crear transacción:', err);
          this.showSnackBar('Error al crear la transacción');
        }
      });
    } else {
      this.showSnackBar('Completa todos los campos antes de continuar.');
    }
  }

  goBack(): void {
    this.location.back();
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }
}
