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

    const ordenarPorVistas = this.ordenSeleccionado === 'vistas';

    if (categoriaId && carreraId && cursoId) {
      if (ordenarPorVistas) {
        this.productService.getProductsByCareerAndCourseAndCategoryViews(carreraId, cursoId, categoriaId).subscribe({
          next: (productos) => (this.productos = productos),
          error: (err) => console.error('Error (vistas, todos los filtros):', err),
        });
      } else {
        this.productService.getProductsByCareerAndCourseAndCategory(carreraId, cursoId, categoriaId).subscribe({
          next: (productos) => (this.productos = productos),
          error: (err) => console.error('Error (todos los filtros):', err),
        });
      }

    } else if (carreraId && cursoId) {
      if (ordenarPorVistas) {
        this.productService.getProductsByCareerAndCourseViews(carreraId, cursoId).subscribe({
          next: (productos) => (this.productos = productos),
          error: (err) => console.error('Error (vistas, carrera + curso):', err),
        });
      } else {
        this.productService.getProductsByCareerAndCourse(carreraId, cursoId).subscribe({
          next: (productos) => (this.productos = productos),
          error: (err) => console.error('Error (carrera + curso):', err),
        });
      }

    } else if (categoriaId) {
      if (ordenarPorVistas) {
        this.productService.getProductsByCategoryViews(categoriaId).subscribe({
          next: (productos) => (this.productos = productos),
          error: (err) => console.error('Error (vistas, categoría):', err),
        });
      } else {
        this.productService.getProductsByCategory(categoriaId).subscribe({
          next: (productos) => (this.productos = productos),
          error: (err) => console.error('Error (categoría):', err),
        });
      }

    } else if (carreraId) {
      if (ordenarPorVistas) {
        this.productService.getProductsByCareerViews(carreraId).subscribe({
          next: (productos) => (this.productos = productos),
          error: (err) => console.error('Error (vistas, carrera):', err),
        });
      } else {
        this.productService.getProductsByCareer(carreraId).subscribe({
          next: (productos) => (this.productos = productos),
          error: (err) => console.error('Error (carrera):', err),
        });
      }

    } else {
      if (ordenarPorVistas) {
        this.productService.getAllProducts().subscribe({
          next: (productos) => (this.productos = productos),
          error: (err) => console.error('Error (vistas, todos):', err),
        });
      } else {
        this.productService.getAllProducts().subscribe({
          next: (productos) => (this.productos = productos),
          error: (err) => console.error('Error (todos):', err),
        });
      }

    }

    this.mostrarFiltros = false;
  }

  cambiarOrden(orden: string) {
    this.ordenSeleccionado = orden;

    // Si ya tienes filtros activos, los vuelves a aplicar
    if (this.filtrosActivos) {
      this.filtrarProductos(this.filtrosActivos);
    } else {
      // Si no hay filtros, puedes cargar todo con orden
      this.filtrarProductos({});
    }
  }

  quitarOrden() {
    this.ordenSeleccionado = '';
    this.filtrarProductos(this.filtrosActivos);
  }

  limpiarFiltros() {
    this.filtrosActivos = {
      categorias: [],
      carreras: [],
      estados: [],
      cursos: [],
      precioMin: null,
      precioMax: null
    };
    this.filtrarProductos(this.filtrosActivos);
  }

  tieneFiltrosActivos(): boolean {
    const f = this.filtrosActivos;
    return (
      (f.categorias && f.categorias.length) ||
      (f.carreras && f.carreras.length) ||
      (f.estados && f.estados.length) ||
      (f.cursos && f.cursos.length) ||
      f.precioMin != null ||
      f.precioMax != null
    );
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
