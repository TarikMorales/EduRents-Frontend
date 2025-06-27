import { Component } from '@angular/core';
import {ProductCardComponent} from "./product-card/product-card.component";
import {FilterProductListComponent} from "./filter-product-list/filter-product-list.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,ProductCardComponent, FilterProductListComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  mostrarFiltros: boolean = false;

  alternarFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  filtrarProductos(filtros: any) {
    console.log('Filtros aplicados:', filtros);
    // Aquí luego filtrarás la lista de productos
  }
}
