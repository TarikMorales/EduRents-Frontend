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

    const categoriaId = filtros.categorias?.[0];
    const carreraId = filtros.carreras?.[0];
    const cursoId = filtros.cursos?.[0];

    // 🧠 Lógica para decidir qué endpoint llamar según los filtros
    if (categoriaId && carreraId && cursoId) {
      // 👉 categoría + carrera + curso
      this.productService.getProductsByCareerAndCourseAndCategory(carreraId, cursoId, categoriaId).subscribe({
        next: (productos) => (this.productos = productos),
        error: (err) => console.error('Error al obtener productos (todos los filtros):', err),
      });

    } else if (carreraId && cursoId) {
      // 👉 carrera + curso
      this.productService.getProductsByCareerAndCourse(carreraId, cursoId).subscribe({
        next: (productos) => (this.productos = productos),
        error: (err) => console.error('Error al obtener productos (carrera + curso):', err),
      });

    } else if (categoriaId && carreraId) {
      // 👉 categoría + carrera (no tienes endpoint directo, podría ser útil crear uno si lo necesitas)
      console.warn('No hay endpoint directo para categoría + carrera. Considera combinarlo en backend.');

    } else if (categoriaId) {
      // 👉 solo categoría
      this.productService.getProductsByCategory(categoriaId).subscribe({
        next: (productos) => (this.productos = productos),
        error: (err) => console.error('Error al obtener productos por categoría:', err),
      });

    } else if (carreraId) {
      // 👉 solo carrera
      this.productService.getProductsByCareer(carreraId).subscribe({
        next: (productos) => (this.productos = productos),
        error: (err) => console.error('Error al obtener productos por carrera:', err),
      });

    } else {
      // ❌ Ningún filtro válido -> cargar todos los productos
      this.productService.getAllProducts().subscribe({
        next: (productos) => (this.productos = productos),
        error: (err) => console.error('Error al obtener todos los productos:', err),
      });
    }

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
