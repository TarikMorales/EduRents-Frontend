import { Routes } from '@angular/router';
//import { publicRoutes } from './pages/public_/public.routes';

export const routes: Routes = [
  {
    path: 'public_',
    loadChildren: () => import('./pages/public_/public.routes').then(m => m.publicRoutes)
  },
  {
    path: '', redirectTo: 'public_/product-detail/1', pathMatch: 'full'
  }
];
