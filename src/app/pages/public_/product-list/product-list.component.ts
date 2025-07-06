import { Component } from '@angular/core';
import {ProductCardComponent} from "./product-card/product-card.component";
import {FilterProductListComponent} from "./filter-product-list/filter-product-list.component";
import {CommonModule} from "@angular/common";
import {ElementRef,ViewChild ,HostListener, OnInit} from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Product } from '../../../shared/model/product-filter/product/producto';
import { ProductService } from '../../../core/services/product-filter/product.service';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, ProductCardComponent, FilterProductListComponent, HttpClientModule,
    NavbarComponent,
    FooterComponent, FormsModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  mostrarFiltros: boolean = false;
  productos: Product[] = [];
  productosOriginales: Product[] = [];
  ordenSeleccionado: string = '';
  filtrosActivos: any = {};
  cargandoProductos: boolean = false;

  @ViewChild('contenedorFiltros') contenedorFiltros!: ElementRef;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    const filtrosGuardados = localStorage.getItem('filtrosGuardados');

    this.filtrosActivos = filtrosGuardados
      ? JSON.parse(filtrosGuardados)
      : {
        categorias: [],
        carreras: [],
        cursos: [],
        estados: [],
        precioMin: null,
        precioMax: null
      };
    this.cargarProductos();
  }

  cargarProductos() {
    this.cargandoProductos = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosOriginales = data;
        this.cargandoProductos = false;
        console.log('Productos cargados:', data);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar productos:', err);
        this.cargandoProductos = false;
      }
    });
  }

  alternarFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  filtrarProductos(filtros: any) {
    this.filtrosActivos = filtros;
    this.cargandoProductos = true;
    console.log('📦 Filtros aplicados:', filtros);

    const ordenarPorVistas = this.ordenSeleccionado === 'vistas';
    const filtrosConOrden = {
      ...filtros,
      ordenarPorVistas: ordenarPorVistas
    };

    this.productService.getProductosFiltrados(filtrosConOrden).subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cargandoProductos = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar productos filtrados:', err);
        this.productos = [];
        this.cargandoProductos = false;
      }
    });

    this.mostrarFiltros = false;
  }

  private tieneFiltrosAplicados(filtros: any): boolean {
    return (
      (filtros.categorias && filtros.categorias.length > 0) ||
      (filtros.carreras && filtros.carreras.length > 0) ||
      (filtros.cursos && filtros.cursos.length > 0) ||
      (filtros.estados && filtros.estados.length > 0) ||
      filtros.precioMin != null ||
      filtros.precioMax != null
    );
  }

  private cargarTodosLosProductos() {
    const ordenarPorVistas = this.ordenSeleccionado === 'vistas';

    this.productService.getAllProducts().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cargandoProductos = false;
      },
      error: (err) => {
        console.error('Error al cargar todos los productos:', err);
        this.productos = [];
        this.cargandoProductos = false;
      },
    });
  }

  private aplicarFiltrosEspecificos(filtros: any) {
    const categoriaId = filtros.categorias?.[0];
    const carreraId = filtros.carreras?.[0];
    const cursoId = filtros.cursos?.[0];

    const ordenarPorVistas = this.ordenSeleccionado === 'vistas';

    // Lógica de filtrado existente pero mejorada
    if (categoriaId && carreraId && cursoId) {
      this.filtrarPorTodosLosCampos(carreraId, cursoId, categoriaId, ordenarPorVistas);
    } else if (carreraId && cursoId) {
      this.filtrarPorCarreraYCurso(carreraId, cursoId, ordenarPorVistas);
    } else if (categoriaId) {
      this.filtrarPorCategoria(categoriaId, ordenarPorVistas);
    } else if (carreraId) {
      this.filtrarPorCarrera(carreraId, ordenarPorVistas);
    } else {
      // Si hay otros filtros (estados, precios) pero no los principales, mostrar todos y filtrar localmente
      this.cargarTodosLosProductosYFiltrarLocalmente(filtros);
    }
  }

  private filtrarPorTodosLosCampos(carreraId: number, cursoId: number, categoriaId: number, ordenarPorVistas: boolean) {
    const service = ordenarPorVistas ?
      this.productService.getProductsByCareerAndCourseAndCategoryViews(carreraId, cursoId, categoriaId) :
      this.productService.getProductsByCareerAndCourseAndCategory(carreraId, cursoId, categoriaId);

    service.subscribe({
      next: (productos) => {
        this.productos = this.aplicarFiltrosLocales(productos, this.filtrosActivos);
        this.cargandoProductos = false;
      },
      error: (err) => {
        console.error('Error (todos los filtros):', err);
        this.productos = [];
        this.cargandoProductos = false;
      },
    });
  }

  private filtrarPorCarreraYCurso(carreraId: number, cursoId: number, ordenarPorVistas: boolean) {
    const service = ordenarPorVistas ?
      this.productService.getProductsByCareerAndCourseViews(carreraId, cursoId) :
      this.productService.getProductsByCareerAndCourse(carreraId, cursoId);

    service.subscribe({
      next: (productos) => {
        this.productos = this.aplicarFiltrosLocales(productos, this.filtrosActivos);
        this.cargandoProductos = false;
      },
      error: (err) => {
        console.error('Error (carrera + curso):', err);
        this.productos = [];
        this.cargandoProductos = false;
      },
    });
  }

  private filtrarPorCategoria(categoriaId: number, ordenarPorVistas: boolean) {
    const service = ordenarPorVistas ?
      this.productService.getProductsByCategoryViews(categoriaId) :
      this.productService.getProductsByCategory(categoriaId);

    service.subscribe({
      next: (productos) => {
        this.productos = this.aplicarFiltrosLocales(productos, this.filtrosActivos);
        this.cargandoProductos = false;
      },
      error: (err) => {
        console.error('Error (categoría):', err);
        this.productos = [];
        this.cargandoProductos = false;
      },
    });
  }

  private filtrarPorCarrera(carreraId: number, ordenarPorVistas: boolean) {
    console.log('🔍 Filtrando por carrera:', carreraId, 'ordenarPorVistas:', ordenarPorVistas);

    const service = ordenarPorVistas ?
      this.productService.getProductsByCareerViews(carreraId) :
      this.productService.getProductsByCareer(carreraId);

    service.subscribe({
      next: (productos) => {
        console.log('✅ Productos recibidos del backend por carrera:', productos.length, productos);
        this.productos = this.aplicarFiltrosLocales(productos, this.filtrosActivos);
        this.cargandoProductos = false;
      },
      error: (err) => {
        console.error('❌ Error al filtrar por carrera:', err);
        console.error('🔗 URL que falló:', err.url);
        console.error('📄 Status:', err.status);
        console.error('📝 Mensaje:', err.message);
        this.productos = [];
        this.cargandoProductos = false;
      },
    });
  }

  private cargarTodosLosProductosYFiltrarLocalmente(filtros: any) {
    this.productService.getAllProducts().subscribe({
      next: (productos) => {
        this.productos = this.aplicarFiltrosLocales(productos, filtros);
        this.cargandoProductos = false;
      },
      error: (err) => {
        console.error('Error al cargar productos para filtro local:', err);
        this.productos = [];
        this.cargandoProductos = false;
      },
    });
  }

  private aplicarFiltrosLocales(productos: Product[], filtros: any): Product[] {
    let productosFiltrados = [...productos];
    const productosIniciales = productosFiltrados.length;

    // Filtrar por estado si está especificado
    if (filtros.estados && filtros.estados.length > 0) {
      productosFiltrados = productosFiltrados.filter(producto =>
        filtros.estados.includes(producto.estado)
      );
      console.log(`Filtro por estado: ${productosFiltrados.length} de ${productosIniciales} productos`);
    }

    // Filtrar por precio mínimo
    if (filtros.precioMin != null) {
      const antesDelFiltro = productosFiltrados.length;
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.precio >= filtros.precioMin
      );
      console.log(`Filtro por precio mínimo (${filtros.precioMin}): ${productosFiltrados.length} de ${antesDelFiltro} productos`);
    }

    // Filtrar por precio máximo
    if (filtros.precioMax != null) {
      const antesDelFiltro = productosFiltrados.length;
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.precio <= filtros.precioMax
      );
      console.log(`Filtro por precio máximo (${filtros.precioMax}): ${productosFiltrados.length} de ${antesDelFiltro} productos`);
    }

    // Filtrar por múltiples categorías (si no se usó el filtro de servidor)
    if (filtros.categorias && filtros.categorias.length > 1) {
      const antesDelFiltro = productosFiltrados.length;
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.categorias.some(categoria =>
          filtros.categorias.includes(categoria.id)
        )
      );
      console.log(`Filtro por categorías múltiples: ${productosFiltrados.length} de ${antesDelFiltro} productos`);
    }

    // Filtrar por múltiples carreras (si no se usó el filtro de servidor)
    if (filtros.carreras && filtros.carreras.length > 1) {
      const antesDelFiltro = productosFiltrados.length;
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.cursos_carreras?.some(cursoCarrera =>
          filtros.carreras.includes(cursoCarrera.curso_carrera.carrera.id)
        )
      );
      console.log(`Filtro por carreras múltiples: ${productosFiltrados.length} de ${antesDelFiltro} productos`);
    }

    // Filtrar por múltiples cursos (si no se usó el filtro de servidor)
    if (filtros.cursos && filtros.cursos.length > 1) {
      const antesDelFiltro = productosFiltrados.length;
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.cursos_carreras?.some(cursoCarrera =>
          filtros.cursos.includes(cursoCarrera.curso_carrera.curso.id)
        )
      );
      console.log(`Filtro por cursos múltiples: ${productosFiltrados.length} de ${antesDelFiltro} productos`);
    }

    console.log(`Resultado final del filtrado: ${productosFiltrados.length} productos de ${productosIniciales} iniciales`);
    return productosFiltrados;
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
    localStorage.removeItem('filtrosGuardados');

    this.filtrosActivos = {
      categorias: [],
      carreras: [],
      estados: [],
      cursos: [],
      precioMin: null,
      precioMax: null
    };
    this.ordenSeleccionado = '';
    this.filtrarProductos(this.filtrosActivos);
  }

  tieneFiltrosActivos(): boolean {
    return this.tieneFiltrosAplicados(this.filtrosActivos);
  }

  get cantidadProductos(): number {
    return this.productos.length;
  }

  get tieneProductos(): boolean {
    return this.productos.length > 0;
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
