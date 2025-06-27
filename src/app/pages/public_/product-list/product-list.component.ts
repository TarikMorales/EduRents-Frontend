import { Component } from '@angular/core';
import {ProductCardComponent} from "./product-card/product-card.component";
import {FilterProductListComponent} from "./filter-product-list/filter-product-list.component";
import {CommonModule} from "@angular/common";
import {ElementRef,ViewChild ,HostListener, OnInit} from "@angular/core";
import { Product } from '../../../models/product/producto';
import { ProductService } from '../../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,ProductCardComponent, FilterProductListComponent, HttpClientModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  mostrarFiltros: boolean = false;
  productos: Product[] = [];
  productosOriginales: Product[] = [];

  @ViewChild('contenedorFiltros') contenedorFiltros!: ElementRef;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosOriginales = data;
        console.log('Productos cargados:', data);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  alternarFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  filtrarProductos(filtros: any) {
    console.log('Filtros aplicados:', filtros);

    const idCategoriaSeleccionada = filtros.categorias?.[0];

    if (!idCategoriaSeleccionada) {
      console.warn('No hay categoría seleccionada');
      this.productos = this.productosOriginales;
      return;
    }

    this.productService.getProductsByCategory(idCategoriaSeleccionada).subscribe({
      next: (productos) => {
        this.productos = productos;
      },
      error: (err) => {
        console.error('Error al obtener productos filtrados:', err);
      }
    });

    this.mostrarFiltros = false;
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (
      this.mostrarFiltros &&
      this.contenedorFiltros &&
      !this.contenedorFiltros.nativeElement.contains(event.target)
    ) {
      this.mostrarFiltros = false;
    }
  }
}
