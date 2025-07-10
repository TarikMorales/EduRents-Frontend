import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../shared/model/product-filter/product/producto';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TransactionService } from '../../../../core/services/transaction.service';
import { AuthResponse } from '../../../../shared/model/login/auth-response.model';
import { TransactionDTO } from '../../../../shared/model/transaction/transaction.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit {

  private router = inject(Router);
  private authService = inject(AuthService);
  private transactionService = inject(TransactionService);
  productoPropio: boolean = false;
  user: AuthResponse | null = null;
  haHechoTransaccionPendiente: boolean = false;
  productoDisponible: boolean = true;

  @Input() producto!: Product;

  ngOnInit(): void {
    if (!this.producto) {
      console.error('Producto no definido en el componente ProductCard');
    }

    if (this.authService.getUser() !== null) {

      this.user = this.authService.getUser();
      this.productoPropio = this.authService.getUser()?.id === this.producto.vendedor.id;

    }

    if (this.user && this.user.id !== undefined && this.user.token) {
      if (this.transactionService.getTransactionsByUser(this.user.id, this.user.token)) {
        let transacciones$ = this.transactionService.getTransactionsByUser(this.user.id, this.user.token);
        if (transacciones$) {
          transacciones$.subscribe({
            next: (transacciones) => {
              this.haHechoTransaccionPendiente = transacciones.some(transaccion => transaccion.producto.id === this.producto.id && transaccion.estado === 'PENDIENTE');
            }
          });
        }
      }
    }

    if (this.producto) {
      this.productoDisponible = this.producto.cantidad_disponible > 0;
    }

  }

  verProducto(id: number) {
    console.log(`Ver producto con ID: ${id}`);
    this.router.navigate(['/public/products', id]);
  }

  iniciarTransaccion(id: number) {
    console.log(`Iniciar transacción para producto con ID: ${id}`);
    this.router.navigate(['/create-transaction'], { queryParams: { idProducto: id } });
  }
}
