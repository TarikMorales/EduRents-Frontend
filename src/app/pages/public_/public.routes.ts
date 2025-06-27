import { Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { SellerProfileComponent } from './seller-profile/seller-profile.component';

export const publicRoutes: Routes = [
  {
    path: 'product-detail/:id',
    component: ProductDetailComponent
  },
  {
    path: 'seller-profile/:id',
    component: SellerProfileComponent
  },
  {
    path: '',
    redirectTo: 'product-detail/1',
    pathMatch: 'full'
  }
];
