import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/product/category';
import {FormsModule} from "@angular/forms";
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filter-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-product-list.component.html',
  styleUrl: './filter-product-list.component.css'
})
export class FilterProductListComponent implements OnInit {
  categorias: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al obtener categorías:', err);
      }
    });
  }

  filtrosDisponibles: string[] = ['Utensilios', 'Decoración', 'Tecnología', 'Ropa', 'Juguetes', 'Papelería'];
  filtrosSeleccionados: number[] = [];

  carrerasDisponibles: string[] = ['Ingeniería', 'Administración', 'Medicina', 'Derecho', 'Diseño', 'Arquitectura'];
  carrerasSeleccionadas: string[] = [];

  estadosDisponibles: string[] = ['Nuevo', 'Seminuevo', 'Usado', 'Muy usado'];
  estadosSeleccionados: string[] = [];

  cursosPorCarrera: { [carrera: string]: string[] } = {
    'Ingeniería': ['Álgebra', 'Programación', 'Cálculo'],
    'Medicina': ['Anatomía', 'Farmacología', 'Fisiología'],
    'Administración': ['Contabilidad', 'Marketing', 'Economía'],
    'Derecho': ['Derecho Penal', 'Derecho Civil', 'Constitucional'],
    'Diseño': ['Diseño gráfico', 'Color y forma', 'Modelado 3D'],
    'Arquitectura': ['AutoCAD', 'Diseño estructural', 'Urbanismo']
  };

  cursosSeleccionados: string[] = [];
  busquedaCurso: string = '';
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
    const value = checkbox.value;

    if (checkbox.checked) {
      this.carrerasSeleccionadas.push(value);
    } else {
      this.carrerasSeleccionadas = this.carrerasSeleccionadas.filter(c => c !== value);
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

  get cursosDisponibles(): string[] {
    const set = new Set<string>();
    this.carrerasSeleccionadas.forEach(carrera => {
      (this.cursosPorCarrera[carrera] || []).forEach(c => set.add(c));
    });
    return Array.from(set);
  }

  toggleCursos() {
    this.mostrarCursosDropdown = !this.mostrarCursosDropdown;
  }

  onCursoChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;

    if (checkbox.checked) {
      this.cursosSeleccionados.push(value);
    } else {
      this.cursosSeleccionados = this.cursosSeleccionados.filter(c => c !== value);
    }
  }

  cursosFiltrados(): string[] {
    const query = this.busquedaCurso.toLowerCase();
    return this.cursosDisponibles.filter(c => c.toLowerCase().includes(query));
  }

  toggleCurso(curso: string) {
    const index = this.cursosSeleccionados.indexOf(curso);
    if (index > -1) {
      this.cursosSeleccionados.splice(index, 1); // deselecciona
    } else {
      this.cursosSeleccionados.push(curso); // selecciona
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


