import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../shared/model/product-filter/product/producto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  private router = inject(Router);

  @Input() producto!: Product;

  verProducto(id: number) {
    console.log(`Ver producto con ID: ${id}`);
    this.router.navigate(['/public/products', id]);
  }

  iniciarTransaccion(id: number) {
    console.log(`Iniciar transacción para producto con ID: ${id}`);
    this.router.navigate(['/create-transaction']);
  }
}
