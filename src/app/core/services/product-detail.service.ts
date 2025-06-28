import { Injectable, Inject, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {

  private baseUrl = `${environment.baseURL}/public/products`; // Use environment configuration
  private http = inject(HttpClient);
  
  constructor() { 
    console.log('ProductDetailService initialized with baseUrl:', this.baseUrl);
    console.log('Environment baseUrl:', environment.baseURL);
    console.log('Full environment object:', environment);
  }

  // Mock data for when backend is not available
  private mockProduct = {
    id: 1,
    nombre: "Calculadora Científica TI-84 Plus",
    precio: 150.00,
    descripcion: "Calculadora científica en excelente estado, perfecta para cursos de matemáticas y estadística.",
    facultad: "Ingeniería",
    cursos: "Matemáticas, Estadística, Física",
    imagenUrl: "https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=TI-84+Plus"
  };

  private mockStock = { id: 1, cantidad_disponible: 5 };
  private mockState = { id: 1, estado: "Excelente" };
  private mockExpiration = { id: 1, fecha_expiracion: "2024-12-31" };
  private mockExchange = { id: 1, acepta_intercambio: true };

  // HU01 - GET /{id}
  getProductById(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    console.log(`Fetching product with ID: ${id} from: ${url}`);
    return this.http.get(url).pipe(
      catchError(error => {
        console.warn(`Error fetching product ${id} from backend:`, error);
        console.log('Using mock data for product');
        return of(this.mockProduct);
      })
    );
  }

  // HU10 - Endpoint 01: GET /{id}/stock
  getStock(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}/stock`;
    console.log(`Fetching stock for product ID: ${id} from: ${url}`);
    return this.http.get(url).pipe(
      catchError(error => {
        console.warn(`Error fetching stock for product ${id}:`, error);
        console.log('Using mock data for stock');
        return of(this.mockStock);
      })
    );
  }

  // HU10 - PUT /{id}/update-stock
  updateStock(id: number, cantidad: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/update-stock`, cantidad);
  }

  // HU10 - Endpoint 02: GET /{id}/expiration-date
  getExpirationDate(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}/expiration-date`;
    console.log(`Fetching expiration date for product ID: ${id} from: ${url}`);
    return this.http.get(url).pipe(
      catchError(error => {
        console.warn(`Error fetching expiration date for product ${id}:`, error);
        console.log('Using mock data for expiration date');
        return of(this.mockExpiration);
      })
    );
  }

  // HU10 - PUT /{id}/expiration-date
  updateExpirationDate(id: number, fechaExpiracion: string): Observable<any> {
    const request = { fecha_expiracion: fechaExpiracion };
    return this.http.put(`${this.baseUrl}/${id}/expiration-date`, request);
  }

  // HU10 - Endpoint 03: GET /{id}/state
  getState(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}/state`;
    console.log(`Fetching state for product ID: ${id} from: ${url}`);
    return this.http.get(url).pipe(
      catchError(error => {
        console.warn(`Error fetching state for product ${id}:`, error);
        console.log('Using mock data for state');
        return of(this.mockState);
      })
    );
  }

  // HU10 - Endpoint 04: GET /{id}/exchange
  getExchange(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}/exchange`;
    console.log(`Fetching exchange info for product ID: ${id} from: ${url}`);
    return this.http.get(url).pipe(
      catchError(error => {
        console.warn(`Error fetching exchange info for product ${id}:`, error);
        console.log('Using mock data for exchange');
        return of(this.mockExchange);
      })
    );
  }

}
