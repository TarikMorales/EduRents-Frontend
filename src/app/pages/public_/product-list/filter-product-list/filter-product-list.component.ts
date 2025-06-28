import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/product/category';
import {FormsModule} from "@angular/forms";
import { EventEmitter, Output } from '@angular/core';
import {Career} from "../../../../models/career";
import { CareerService } from '../../../../services/career.service';
import {Course} from "../../../../models/course";
import { CoursesService } from '../../../../services/courses.service';

@Component({
  selector: 'app-filter-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-product-list.component.html',
  styleUrl: './filter-product-list.component.css'
})
export class FilterProductListComponent implements OnInit {
  categorias: Category[] = [];
  carreras: Career[] = [];
  cursos: Course[] = []; // Course tiene id, nombre, codigo

  busquedaCurso: string = '';
  cursosSeleccionados: number[] = [];

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
      },
      error: (err) => {
        console.error('Error al obtener carreras:', err);
      }
    })
  }

  filtrosSeleccionados: number[] = [];

  carrerasDisponibles: string[] = ['Ingeniería', 'Administración', 'Medicina', 'Derecho', 'Diseño', 'Arquitectura'];
  carrerasSeleccionadas: number[] = [];

  estadosDisponibles: string[] = ['Nuevo', 'Seminuevo', 'Usado', 'Muy usado'];
  estadosSeleccionados: string[] = [];

  mostrarCursosDropdown: boolean = false;

  precioMin: number | null = null;
  precioMax: number | null = null;

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = parseInt(checkbox.value, 10);

    if (checkbox.checked) {
      this.filtrosSeleccionados.push(value);
    } else {
      this.filtrosSeleccionados = this.filtrosSeleccionados.filter(id => id !== value);
    }
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
  }


  onEstadoChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;

    if (checkbox.checked) {
      this.estadosSeleccionados.push(value);
    } else {
      this.estadosSeleccionados = this.estadosSeleccionados.filter(e => e !== value);
    }
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
  }

    @Output() filtrosAplicados = new EventEmitter<any>();
  aplicarFiltros() {
    this.filtrosAplicados.emit({
      categorias: this.filtrosSeleccionados,
      carreras: this.carrerasSeleccionadas,
      estados: this.estadosSeleccionados,
      cursos: this.cursosSeleccionados,
      precioMin: this.precioMin,
      precioMax: this.precioMax
    });
  }

  close() {
    console.log('Cerrando ventana de filtros');
    // Aquí puedes ocultar el componente si es condicional (*ngIf)
  }
}


