import { Routes } from '@angular/router';
import {ProductListComponent} from "./pages/public_/product-list/product-list.component";
import {ProductCardComponent} from "./pages/public_/product-list/product-card/product-card.component"
import {FilterProductListComponent} from "./pages/public_/product-list/filter-product-list/filter-product-list.component";
import {ProductListHomeComponent} from "./pages/public_/product-list/product-list-home/product-list-home.component";

export const routes: Routes = [
  {
    path: 'product-list',
    component: ProductListComponent,
  },
  {
    path: 'product-card',
    component: ProductCardComponent,
  },
  {
    path: 'filter-product-list',
    component: FilterProductListComponent,
  },
  {
    path: 'product-list-home',
    component: ProductListHomeComponent,
  }
];
