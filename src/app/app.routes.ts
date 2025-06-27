import { Routes } from '@angular/router';
import { LandingComponent } from './pages/public_/landing/landing.component';



export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.routes').then(a=>a.authRoutes)
    },
    {
        path: '',
        component: LandingComponent
    },
    {
    path: 'public_',
    loadChildren: () => import('./pages/public_/public.routes').then(m => m.publicRoutes)
  },
  {
    path: '', redirectTo: 'public_/product-detail/1', pathMatch: 'full'
  }
];


