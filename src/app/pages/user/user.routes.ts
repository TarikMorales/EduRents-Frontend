import { Routes } from '@angular/router';
import { AlertsComponent } from './alerts/alerts.component';
import { ProfileComponent } from './profile/profile.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { FollowedProductsComponent } from './followed-products/followed-products.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

export const userRoutes: Routes = [
    {
        path: 'alerts',
        component: AlertsComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'transactions',
        component: TransactionsComponent
    },
    {
        path: 'followed-products',
        component: FollowedProductsComponent
    },
    {
        path: 'change-password',
        component: ChangePasswordComponent
    }
];
