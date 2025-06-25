import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  faculty: string;
  courses: string;
  imageUrl: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule,RouterOutlet,NavbarComponent],
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

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // Use mock data for now to confirm UI and routing work
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.product = {
      id: this.productId,
      name: 'Test Product',
      price: 100,
      description: 'A test product for UI demo',
      faculty: 'Engineering',
      courses: 'Math, Physics',
      imageUrl: ''
    };
    this.stock = 5;
    this.state = 'Nuevo';
    this.expirationDate = '2024-12-31';
    this.exchangeAvailable = true;

    // Commented out real API calls for now
    // this.getProduct(this.productId).subscribe(p => this.product = p);
    // this.getStock(this.productId).subscribe(res => this.stock = res.stock);
    // this.getState(this.productId).subscribe(res => this.state = res.state);
    // this.getExpirationDate(this.productId).subscribe(res => this.expirationDate = res.expirationDate);
    // this.getExchange(this.productId).subscribe(res => this.exchangeAvailable = res.exchange);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`/api/products/${id}`);
  }
  getStock(id: number): Observable<{ stock: number }> {
    return this.http.get<{ stock: number }>(`/api/products/${id}/stock`);
  }
  getState(id: number): Observable<{ state: string }> {
    return this.http.get<{ state: string }>(`/api/products/${id}/state`);
  }
  getExpirationDate(id: number): Observable<{ expirationDate: string }> {
    return this.http.get<{ expirationDate: string }>(`/api/products/${id}/expiration-date`);
  }
  getExchange(id: number): Observable<{ exchange: boolean }> {
    return this.http.get<{ exchange: boolean }>(`/api/products/${id}/exchange`);
  }
}
