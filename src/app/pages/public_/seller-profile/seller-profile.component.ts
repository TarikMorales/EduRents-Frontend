import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { SellerProfileService, ShowProductDTO } from '../../../core/services/seller-profile.service';
import { SellerProfileResponse } from '../../../shared/model/public-resources/seller-profile-response.model';

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.css']
})
export class SellerProfileComponent implements OnInit {
  sellerId!: number;
  seller?: SellerProfileResponse;
  products: ShowProductDTO[] = [];
  showProducts = false;
  loading = true;
  error = false;
  loadingProducts = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sellerService: SellerProfileService
  ) {}

  ngOnInit() {
    this.sellerId = +this.route.snapshot.paramMap.get('id')!;
    this.loadSellerData();
  }

  loadSellerData() {
    this.loading = true;
    this.error = false;
    this.sellerService.getSellerById(this.sellerId).subscribe({
      next: (sellerData: SellerProfileResponse) => {
        this.seller = sellerData;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading seller:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  getSellerName(): string {
    return this.seller?.nombreUsuario || '---';
  }
  getSellerReview(): string {
    return this.seller?.resena || 'Sin reseña';
  }
  isSellerReliable(): boolean {
    return !!this.seller?.confiabilidad;
  }
  isSellerOnTime(): boolean {
    return !!this.seller?.sin_demoras;
  }
  isSellerAttentive(): boolean {
    return !!this.seller?.buena_atencion;
  }

  onShowProducts() {
    this.showProducts = !this.showProducts;
    if (this.showProducts && this.products.length === 0) {
      this.loadingProducts = true;
      this.sellerService.getSellerProducts(this.sellerId).subscribe({
        next: (products) => {
          this.products = products;
          this.loadingProducts = false;
        },
        error: (err) => {
          this.loadingProducts = false;
          console.error('Error loading products:', err);
        }
      });
    }
  }

  goToProductDetail(productId: number) {
    this.router.navigate(['/public_/product-detail', productId]);
  }
} 