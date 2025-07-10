import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyTokenComponent } from './verify-token/verify-token.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const authRoutes: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        children:[
            {path:'login', component:LoginComponent},
            {path:'register', component:RegisterComponent},
            {path: 'forgot-password', component: ForgotPasswordComponent},
            {path: 'verify-token', component: VerifyTokenComponent},
            {path: 'reset-password', component: ResetPasswordComponent}
        ]

    }
];