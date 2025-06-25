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
    }
];

