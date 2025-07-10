import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ExchangeOfferService } from '../../../../core/services/exchange-offer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { ProductService } from '../../../../core/services/product-filter/product.service';
import { ProductResponse } from '../../../../shared/model/product/product-response.model';

@Component({
  selector: 'app-create-exchange-offer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    MatSnackBarModule
],
  templateUrl: './create-exchange-offer.component.html',
  styleUrls: ['./create-exchange-offer.component.css']
})
export class CreateExchangeOfferComponent implements OnInit {
  form: FormGroup;
  token: string = '';
  idUsuario!: number;
  idProducto!: number;
  producto!: ProductResponse;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private exchangeOfferService: ExchangeOfferService,
    private snackBar: MatSnackBar,
    private productService: ProductService
  ) {
    this.form = this.fb.group({
      mensaje_propuesta: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    const user = this.authService.getUser();

    if (!user) {
      this.snackBar.open('Debes iniciar sesión para proponer un intercambio.', 'Cerrar', {
        duration: 3000
      });
      this.router.navigate(['/auth/login']);
      return;
    }

    this.idUsuario = user.id;
    this.token = user.token;

    this.route.queryParams.subscribe(params => {
      const idProductoRaw = params['idProducto'];
      if (!idProductoRaw || isNaN(+idProductoRaw)) {
        this.snackBar.open('Producto inválido.', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/']);
        return;
      }
      this.idProducto = +idProductoRaw;

      this.productService.getProductById(this.idProducto).subscribe({
        next: (producto) => {
          this.producto = producto;
        },
        error: () => {
          this.snackBar.open('Error al cargar el producto.', 'Cerrar', {
            duration: 3000
          });
        }
      });
    });
  }

  enviarPropuesta(): void {
    if (this.form.invalid) {
      this.snackBar.open('Completa el mensaje de propuesta correctamente.', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const payload = {
      id_usuario: this.idUsuario,
      id_producto: this.idProducto,
      mensaje_propuesta: this.form.value.mensaje_propuesta!
    };

    this.exchangeOfferService.crearOfertaIntercambio(payload, this.token).subscribe({
      next: () => {
        this.snackBar.open('Oferta de intercambio enviada con éxito.', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/mi-historial']);
      },
      error: () => {
        this.snackBar.open('Error al enviar la propuesta.', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
