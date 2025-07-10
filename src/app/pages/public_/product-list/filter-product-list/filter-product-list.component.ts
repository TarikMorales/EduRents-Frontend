import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import { EventEmitter, Output } from '@angular/core';
import { CategoryService } from '../../../../core/services/product-filter/category.service';
import { CareerService } from '../../../../core/services/product-filter/career.service';
import { CoursesService } from '../../../../core/services/product-filter/courses.service';
import { Category } from '../../../../shared/model/product-filter/product/category';
import { Career } from '../../../../shared/model/product-filter/career';
import { Course } from '../../../../shared/model/product-filter/course';

@Component({
  selector: 'app-filter-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-product-list.component.html',
  styleUrl: './filter-product-list.component.css'
})
export class FilterProductListComponent implements OnInit {
  // Datos cargados
  categorias: Category[] = [];
  carreras: Career[] = [];
  cursos: Course[] = [];

  // Filtros seleccionados
  filtrosSeleccionados: number[] = [];
  carrerasSeleccionadas: number[] = [];
  cursosSeleccionados: number[] = [];
  estadosSeleccionados: string[] = [];

  // Datos estáticos
  carrerasDisponibles: string[] = ['Ingeniería', 'Administración', 'Medicina', 'Derecho', 'Diseño', 'Arquitectura'];
  estadosDisponibles: string[] = ['Nuevo', 'Seminuevo', 'Usado', 'Muy usado'];

  // Filtros de búsqueda
  busquedaCurso: string = '';
  precioMin: number | null = null;
  precioMax: number | null = null;

  // Control UI
  mostrarCursosDropdown: boolean = false;

  // Comunicación con el padre
  @Output() filtrosAplicados = new EventEmitter<any>();

  // Referencia al dropdown
  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  constructor(private categoryService: CategoryService
              , private careerService: CareerService,
              private courseService: CoursesService) {}

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al obtener categorías:', err);
      }
    });

    this.careerService.getAllCareers().subscribe({
      next: (data) => {
        this.carreras = data;
        this.restaurarFiltrosGuardados(); // ← después de cargar carreras
      },
      error: (err) => {
        console.error('Error al obtener carreras:', err);
      }
    })
  }

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = parseInt(checkbox.value, 10);

    if (checkbox.checked) {
      this.filtrosSeleccionados.push(value);
    } else {
      this.filtrosSeleccionados = this.filtrosSeleccionados.filter(id => id !== value);
    }

    this.guardarFiltrosEnLocalStorage();
  }

  onCarreraChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = parseInt(checkbox.value, 10);

    if (checkbox.checked) {
      this.carrerasSeleccionadas.push(value);
    } else {
      this.carrerasSeleccionadas = this.carrerasSeleccionadas.filter(id => id !== value);
    }

    if (this.carrerasSeleccionadas.length === 1) {
      const selectedCareerId = this.carrerasSeleccionadas[0];
      this.courseService.getCoursesByCareer(selectedCareerId).subscribe({
        next: (data) => {
          console.log('✅ Cursos recibidos:', data);
          //this.mostrarCursosDropdown = true;
          this.cursos = data;
        },
        error: (err) => {
          console.error('Error al obtener cursos:', err);
          this.cursos = [];
        }
      });
    } else {
      this.cursos = [];
    }

    this.guardarFiltrosEnLocalStorage();
  }

  onEstadoChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;

    if (checkbox.checked) {
      this.estadosSeleccionados.push(value);
    } else {
      this.estadosSeleccionados = this.estadosSeleccionados.filter(e => e !== value);
    }

    this.guardarFiltrosEnLocalStorage();
  }

  cursosFiltrados(): Course[] {
    const query = this.busquedaCurso.toLowerCase();
    return this.cursos.filter(curso => curso.nombre.toLowerCase().includes(query));
  }

  toggleCursos() {
    this.mostrarCursosDropdown = !this.mostrarCursosDropdown;
  }

  toggleCurso(curso: Course) {
    const index = this.cursosSeleccionados.indexOf(curso.id);
    if (index > -1) {
      this.cursosSeleccionados.splice(index, 1); // deselecciona
    } else {
      this.cursosSeleccionados.push(curso.id); // selecciona
    }
    this.guardarFiltrosEnLocalStorage();
  }
  aplicarFiltros() {
    const filtrosParaEnviar = {
      categorias: this.filtrosSeleccionados,
      carreras: this.carrerasSeleccionadas,
      cursos: this.cursosSeleccionados,
      precioMin: this.precioMin,
      precioMax: this.precioMax,
      estado: this.estadosSeleccionados[0] ?? undefined // solo uno por ahora
    };

    // Guardar en localStorage
    localStorage.setItem('filtrosGuardados', JSON.stringify(filtrosParaEnviar));

    console.log('📋 Filtros aplicados desde el componente de filtros:', filtrosParaEnviar);
    this.filtrosAplicados.emit(filtrosParaEnviar);
  }

  limpiarFiltros() {
    localStorage.removeItem('filtrosGuardados');

    this.filtrosSeleccionados = [];
    this.carrerasSeleccionadas = [];
    this.cursosSeleccionados = [];
    this.estadosSeleccionados = [];
    this.precioMin = null;
    this.precioMax = null;
  }

  restaurarFiltrosGuardados() {
    const filtros = localStorage.getItem('filtrosGuardados');
    if (!filtros) return;

    const datos = JSON.parse(filtros);

    this.filtrosSeleccionados = datos.categorias || [];
    this.carrerasSeleccionadas = datos.carreras || [];
    this.cursosSeleccionados = datos.cursos || [];
    this.precioMin = datos.precioMin ?? null;
    this.precioMax = datos.precioMax ?? null;
    this.estadosSeleccionados = datos.estado ? [datos.estado] : [];

    // ✅ Cargar cursos si hay una carrera seleccionada
    if (this.carrerasSeleccionadas.length === 1) {
      const selectedCareerId = this.carrerasSeleccionadas[0];
      this.courseService.getCoursesByCareer(selectedCareerId).subscribe({
        next: (cursos) => {
          this.cursos = cursos;
        },
        error: (err) => {
          console.error('Error al obtener cursos para restaurar:', err);
          this.cursos = [];
        }
      });
    }
  }
  guardarFiltrosEnLocalStorage() {
    const filtrosParaGuardar = {
      categorias: this.filtrosSeleccionados,
      carreras: this.carrerasSeleccionadas,
      cursos: this.cursosSeleccionados,
      precioMin: this.precioMin,
      precioMax: this.precioMax,
      estado: this.estadosSeleccionados[0] ?? null
    };

    localStorage.setItem('filtrosGuardados', JSON.stringify(filtrosParaGuardar));
  }

  //Para cerrar el dropdown de cursos al dar click fuera
  @HostListener('document:click', ['$event'])
  onClickFuera(event: MouseEvent) {
    if (
      this.mostrarCursosDropdown &&
      this.dropdownRef &&
      !this.dropdownRef.nativeElement.contains(event.target)
    ) {
      this.mostrarCursosDropdown = false;
    }
  }
}


