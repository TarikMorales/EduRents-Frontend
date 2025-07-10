import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ProductDetailService } from '../../../core/services/product-detail.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { Location } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { TransactionDTO } from '../../../shared/model/transaction/transaction.model';
import { ExchangeOfferService } from '../../../core/services/exchange-offer.service';
import { ExchangeOfferResponse } from '../../../shared/model/exchange-offer/exchange-offer.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FollowedProductService } from '../../../core/services/followed-product.service';
import { AlertsService, CreateAlertDTO } from '../../../core/services/alerts.service';

// Interfaces for type safety
interface Product {
  id: number;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  estado?: string;
  cantidad_disponible?: number;
  acepta_intercambio?: boolean;
  fecha_creacion?: string;
  fecha_modificacion?: string;
  fecha_expiracion?: string;
  vistas?: number;
  vendedor?: {
    id: number;
    presentacion: string;
    confiabilidad: boolean;
    sin_demoras: boolean;
    buena_atencion: boolean;
    nombreUsuario: string;
    nombreNegocio: string;
    correoElectronico: string;
    numeroTelefono: number;
  };
  imagenes?: any[];
  categorias?: any[];
  cursos_carreras?: any[];
}

interface StockResponse {
  id: number;
  cantidad_disponible: number;
}

interface StateResponse {
  id?: number;
  estado?: string;
  state?: string;
}

interface ExpirationResponse {
  id?: number;
  fecha_expiracion?: string;
  expirationDate?: string;
}

interface ExchangeResponse {
  id?: number;
  acepta_intercambio?: boolean;
  exchange?: boolean;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  productId!: number;
  product?: Product;
  stock?: number;
  state?: string;
  expirationDate?: string;
  exchangeAvailable?: boolean;
  loading = true;
  error = false;
  private location: Location;

  yaExisteTransaccionPendiente: boolean = false;
  usuarioId!: number;
  usuarioLogueado: boolean = false;

  transaccionActual: TransactionDTO | null = null;
  esVendedorDelProducto: boolean = false;

  intercambios: ExchangeOfferResponse[] = [];

  haHechoIntercambio: boolean = false;

  productoDisponible: boolean = true;
  sigueElProducto : boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productDetailService: ProductDetailService,
    private router: Router,
    private transactionService: TransactionService,
    private authService: AuthService,
    private exchangeOfferService: ExchangeOfferService,
    private snackBar: MatSnackBar,
    private followedProductService: FollowedProductService,
    private alertsService: AlertsService,
    location: Location
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProductData();

    const user = this.authService.getUser();
    if (user && user.id) {
      this.usuarioLogueado = true;
      this.usuarioId = user.id;
      this.validarTransaccionExistente();
    }

    // Cargar intercambios del producto
    this.exchangeOfferService.getOfertasPorUsuario(this.usuarioId, user?.token || '').subscribe({
      next: (intercambios) => {
        this.intercambios = intercambios.filter(intercambio => intercambio.producto?.id === this.productId);
        this.haHechoIntercambio = this.intercambios.length > 0;
      },
      error: (error) => {
        console.error('Error al cargar intercambios:', error);
      }
    });

    // Verificar si el usuario sigue el producto
    if (user) {
      this.followedProductService.getFollowedProducts(user.id).subscribe({
        next: (followedProducts) => {
          this.sigueElProducto = followedProducts.some(product => product.id === this.productId);
        }
      });
    }
  }

  validarTransaccionExistente() {
    const user = this.authService.getUser();
    const token = user?.token;

    if (!user || !token || !this.productId) return;

    this.transactionService.getTransactionsByUser(user.id, token).subscribe({
      next: (transaccions) => {
        for (const transaccion of transaccions) {
          if (transaccion.producto.id === this.productId && transaccion.estado === 'PENDIENTE') {
            this.transaccionActual = transaccion;
            this.yaExisteTransaccionPendiente = true;
            this.esVendedorDelProducto = transaccion.producto.vendedor?.id === user.id;
            return;
          }
        }
      },
      error: (err) => {
        if (err.status === 404) {
          this.transaccionActual = null;
        } else {
          console.error('Error al verificar transacción existente:', err);
        }
      }
    });
  }

  verTransaccion() {
    if (!this.transaccionActual) return;

    const ruta = this.transaccionActual.metodo_pago === 'EFECTIVO'
      ? '/transaccion-efectivo'
      : '/transaccion-guardada-virtual';

    this.router.navigate([ruta], {
      queryParams: { idTransaccion: this.transaccionActual.id }
    });
  }

  loadProductData() {
    this.loading = true;
    this.error = false;

    // HU01 - Get product by ID (contains all the data we need)
    this.productDetailService.getProductById(this.productId).subscribe({
      next: (productData: Product) => {
        this.product = productData;
        // Extract data from the main product response
        this.stock = productData.cantidad_disponible;
        this.state = productData.estado;
        this.expirationDate = productData.fecha_expiracion;
        this.exchangeAvailable = productData.acepta_intercambio;

        if (productData.cantidad_disponible !== undefined && productData.cantidad_disponible > 0) {
          this.productoDisponible = true;
        } else {
          this.productoDisponible = false;
          this.stock = 0;
        }

        const user = this.authService.getUser();
        if (user) {
          this.esVendedorDelProducto = productData.vendedor?.id === user.id;
          if (!this.esVendedorDelProducto) {
            this.productDetailService.incrementViewCount(this.productId).subscribe({
              next: () => {
                console.log('Número de vistas incrementado correctamente.');
              }
            });
          }
        }

        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  // Helper methods for template
  getProductName(): string {
    return this.product?.nombre || 'Sin nombre';
  }

  getProductPrice(): string {
    return this.product?.precio ? `S/. ${this.product.precio.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` : '---';
  }

  getProductCarreers(): string {
    let cursos_carreras = '';
    if (this.product?.cursos_carreras?.length) {
        for (const item of this.product.cursos_carreras) {
            let curso_carrera = item.curso + '(' + item.carrera + ')';
            cursos_carreras += curso_carrera + ', ';
        }
    }
    return cursos_carreras || '---';
  }
  getProductCategories(): string {
    let categorias = '';
    if (this.product?.categorias?.length) {
      categorias = this.product.categorias.map((cat: any) => cat.nombre || cat).join(', ');
    }
    return categorias || '---';
  }

  getProductDescription(): string {
    return this.product?.descripcion || '---';
  }

  getProductImage(): string {
    return this.product?.imagenes?.length ? this.product.imagenes[0].url : 'assets/NoImage.png';
  }

  getStockText(): string {
    if (this.stock === undefined || this.stock === null) {
      return '---';
    }
    return this.stock > 0 ? this.stock.toString() + " unidad(es)" : 'Sin stock';
  }

  getExchangeText(): string {
    return this.exchangeAvailable ? 'Disponible' : 'No disponible';
  }

  getStateText(): string {
    return this.state || '---';
  }

  getExpirationText(): string {
    return this.expirationDate || '---';
  }

  getSellerName(): string {
    return this.product?.vendedor?.nombreUsuario || '---';
  }

  getSellerDeals(): string {
    return /* '+100 Tratos concretados' */'';//remplazar con datos del vendedor
  }

  isSellerReliable(): boolean {
    return !!this.product?.vendedor?.confiabilidad;
  }

  isSellerOnTime(): boolean {
    return !!this.product?.vendedor?.sin_demoras;
  }

  isSellerAttentive(): boolean {
    return !!this.product?.vendedor?.buena_atencion;
  }

  goToSellerProfile() {
    if (this.product?.vendedor?.id) {
      this.router.navigate(['/public/seller-profile', this.product.vendedor.id]);
    }
  }

  onBuyNow() {
    if (this.product?.id) {
      this.router.navigate(['/create-transaction'], {
        queryParams: { idProducto: this.product.id }
      });
    }
  }

  onProposeExchange(): void {
    if (!this.authService.getUser()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.router.navigate(['/create-exchange-offer'], {
      queryParams: { idProducto: this.productId }
    });
  }


  goBack(){
    this.location.back();
  }

  seguirProducto() {
    const user = this.authService.getUser();
    if (!user) {
      this.snackBar.open('Debes iniciar sesión para seguir productos', 'Cerrar', { duration: 3000 });
      return;
    }
    this.followedProductService.followProduct(user.id, this.productId).subscribe({
      next: () => {
        const alerta: CreateAlertDTO = {
          tipo: 'OTRO',
          mensaje: 'Producto seguido',
          visto: false,
          id_producto: this.productId,
          id_usuario: user.id
        };
        this.alertsService.createAlert(alerta).subscribe({
          next: () => {
            this.snackBar.open('¡Producto seguido y alerta creada!', 'Cerrar', { duration: 3000 });
            window.location.reload();
          },
          error: () => {
            this.snackBar.open('Producto seguido, pero error al crear la alerta', 'Cerrar', { duration: 3000 });
          }
        });
      },
      error: (err) => {
        if (err.status === 400) {
          this.snackBar.open('Ya sigues este producto.', 'Cerrar', { duration: 3000 });
        } else {
          this.snackBar.open('Error al seguir el producto', 'Cerrar', { duration: 3000 });
        }
      }
    });
  }

  dejarDeSeguirProducto() {
    const user = this.authService.getUser();
    if (!user) {
      this.snackBar.open('Debes iniciar sesión para dejar de seguir productos', 'Cerrar', { duration: 3000 });
      return;
    }
    this.followedProductService.unfollowProduct(user.id, this.productId).subscribe({
      next: () => {

        const alerta: CreateAlertDTO = {
          tipo: 'OTRO',
          mensaje: 'Producto dejado de seguir',
          visto: false,
          id_producto: this.productId,
          id_usuario: user.id
        };
        this.alertsService.createAlert(alerta).subscribe({
          next: () => {
            this.snackBar.open('¡Producto dejado de seguir y alerta creada!', 'Cerrar', { duration: 3000 });
            window.location.reload();
          },
          error: () => {
            this.snackBar.open('Producto dejado de seguir, pero error al crear la alerta', 'Cerrar', { duration: 3000 });
          }
        });

      },
      error: (err) => {
        if (err.status === 404) {
          this.snackBar.open('No sigues este producto.', 'Cerrar', { duration: 3000 });
        } else {
          this.snackBar.open('Error al dejar de seguir el producto', 'Cerrar', { duration: 3000 });
        }
      }
    });
  }

}
