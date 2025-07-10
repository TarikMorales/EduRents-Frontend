import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PublicResourcesService } from '../../../core/services/public-resources.service';
import { SellerProductService } from '../../../core/services/seller-product.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductResponse } from '../../../shared/model/product/product-response.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink, MatSnackBarModule, CommonModule],
  templateUrl: './my-products.component.html',
  styleUrl: './my-products.component.css'
})
export class MyProductsComponent implements OnInit {

  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private publicResourcesService = inject(PublicResourcesService);
  private sellerProductService = inject(SellerProductService);

  productos : ProductResponse[] = [];
  hayProductos: boolean = false;

  constructor() { }

  ngOnInit(): void {
    
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
    }

    if(this.authService.getUser()?.rol !== 'SELLER') {
      this.showSnackBar('No tienes permisos para acceder a esta página (No eres un vendedor)');
      this.router.navigate(['/']);
    }

    this.sellerProductService.getProductsBySeller(this.authService.getUser()?.id || 0, this.authService.getUser()?.token || '').subscribe({ 
      next: (productos) => {
        this.productos = productos;
      
        if (this.productos.length === 0) {
          this.showSnackBar('No tienes productos registrados');
        } else {
          this.hayProductos = true;
        }
      },
      error: () => {
        this.showSnackBar('Error al obtener los productos del vendedor');
      }
    });

  }

  private showSnackBar(message: string): void{
    this.snackBar.open(message, 'Close',{
      duration: 2000,
      verticalPosition: 'top'
    })
  }

  editarProducto(productId: number): void {
    console.log(`Editar producto con ID: ${productId}`);
    this.router.navigate(['/seller/edit-product', productId]);
  }

}
