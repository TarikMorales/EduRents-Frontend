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

  yaExisteTransaccion: boolean = false;
  usuarioId!: number;

  transaccionActual: TransactionDTO | null = null;
  esVendedorDelProducto: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productDetailService: ProductDetailService,
    private router: Router,
    private transactionService: TransactionService,
    private authService: AuthService,
    location: Location
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProductData();

    const user = this.authService.getUser();
    if (user && user.id) {
      this.usuarioId = user.id;
      this.validarTransaccionExistente();
    }
  }

  validarTransaccionExistente() {
    const user = this.authService.getUser();
    const token = user?.token;

    if (!user || !token || !this.productId) return;

    this.transactionService.getTransactionByUserAndProduct(user.id, this.productId, token).subscribe({
      next: (transaccion) => {
        if (transaccion.estado === 'CANCELADO') {
          this.transaccionActual = null;
        } else {
          this.transaccionActual = transaccion;
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

        const user = this.authService.getUser();
        if (user) {
          this.esVendedorDelProducto = productData.vendedor?.id === user.id;
        }

        this.loading = false;
        console.log('Product data received:', productData);
      },
      error: (error) => {
        console.error('Error loading product:', error);
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
    return this.stock !== undefined ? `${this.stock} unidad` : '---';
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
}
