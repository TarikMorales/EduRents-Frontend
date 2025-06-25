import { Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';

export const publicRoutes: Routes = [
  {
    path: 'product-detail/:id',
    component: ProductDetailComponent
  },
  {
    path: '',
    redirectTo: 'product-detail/1',
    pathMatch: 'full'
  }
];
