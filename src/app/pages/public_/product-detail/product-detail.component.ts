import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ProductDetailService } from '../../../core/services/product-detail.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

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
    resena: string;
    confiabilidad: boolean;
    sin_demoras: boolean;
    buena_atencion: boolean;
    nombreUsuario: string;
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

  constructor(
    private route: ActivatedRoute, 
    private productDetailService: ProductDetailService
  ) {}

  ngOnInit() {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProductData();
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
    return this.product?.precio ? `S/. ${this.product.precio}` : '---';
  }

  getProductFaculty(): string {
    return this.product?.vendedor?.nombreUsuario || '---';
  }

  getProductCourses(): string {
    return this.product?.cursos_carreras?.length ? this.product.cursos_carreras.join(', ') : '---';
  }

  getProductDescription(): string {
    return this.product?.descripcion || '---';
  }

  getProductImage(): string {
    return this.product?.imagenes?.length ? this.product.imagenes[0] : 'https://via.placeholder.com/200x300';
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
}
