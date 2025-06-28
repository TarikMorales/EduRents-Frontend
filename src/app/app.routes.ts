import { Routes } from '@angular/router';
import { LandingComponent } from './pages/public_/landing/landing.component';
import { CreateTransactionComponent } from './pages/user/transactions/create-transaction/create-transaction.component';
import { PagoConfirmadoComponent } from './pages/user/transactions/pago-confirmado/pago-confirmado.component';
import { ReclamarEntregaComponent } from './pages/user/transactions/reclamar-entrega/reclamar-entrega.component';
import { HistorialPagosComponent } from './pages/user/transactions/historial-pagos/historial-pagos.component';
import { SellerHistorialPagosComponent } from './pages/seller/transactions/seller-historial-pagos/seller-historial-pagos.component';
import { GooglePayComponent } from './pages/user/transactions/google-pay/google-pay.component';
import { ApplePayComponent } from './pages/user/transactions/apple-pay/apple-pay.component';
import { BancaComponent } from './pages/user/transactions/banca/banca.component';
import { TransaccionGuardadaVirtualComponent } from './pages/user/transactions/transaccion-guardada-virtual/transaccion-guardada-virtual.component';
import { CreatePaymentCardComponent } from './pages/user/transactions/create-payment-card/create-payment-card.component';
import { TransaccionEfectivoComponent } from './pages/user/transactions/transaccion-efectivo/transaccion-efectivo.component';
import { TransaccionCanceladaComponent } from './pages/user/transactions/transaccion-cancelada/transaccion-cancelada.component';
import { ReclamoEnviadoComponent } from './pages/user/transactions/reclamo-enviado/reclamo-enviado.component';
import { HistorialGeneralComponent } from './pages/user/historial-general/historial-general.component';
import { SellerHistorialGeneralComponent } from './pages/seller/seller-historial-general/seller-historial-general.component';
import { ProductListComponent } from './pages/public_/product-list/product-list.component';
import { ProductCardComponent } from './pages/public_/product-list/product-card/product-card.component';
import { FilterProductListComponent } from './pages/public_/product-list/filter-product-list/filter-product-list.component';
import { ProductListHomeComponent } from './pages/public_/product-list/product-list-home/product-list-home.component';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.routes').then(a=>a.authRoutes)
    },
    {
        path: 'user',
        loadChildren: () => import('./pages/user/user.routes').then(u => u.userRoutes)
    },
    {
        path: 'seller',
        loadChildren: () => import('./pages/seller/seller.routes').then(s => s.sellerRoutes)
    },
    {
        path: 'public',
        loadChildren: () => import('./pages/public_/public.routes').then(m => m.publicRoutes)
    },
    {
        path: '',
        component: LandingComponent
    },
    { path: 'create-transaction', component: CreateTransactionComponent },
    { path: 'pago-confirmado', component: PagoConfirmadoComponent },
    { path: 'reclamar-entrega', component: ReclamarEntregaComponent },
    { path: 'historial-pagos', component: HistorialPagosComponent },
    { path: 'seller/transactions', component: SellerHistorialPagosComponent },
    { path: 'pago/google-pay', component: GooglePayComponent },
    { path: 'pago/apple-pay', component: ApplePayComponent },
    { path: 'pago/banca', component: BancaComponent },
    { path: 'transaccion-guardada-virtual', component: TransaccionGuardadaVirtualComponent },
    { path: 'create-transaction', component: CreateTransactionComponent },
    { path: 'pago-tarjeta', component: CreatePaymentCardComponent },
    { path: 'transaccion-efectivo', component: TransaccionEfectivoComponent },
    { path: 'transaccion-guardada-virtual', component: TransaccionGuardadaVirtualComponent },
    { path: 'transaccion-cancelada', component: TransaccionCanceladaComponent },
    { path: 'reclamo-enviado', component: ReclamoEnviadoComponent},
    { path: 'mi-historial', component: HistorialGeneralComponent },
    { path: 'seller/historial', component: SellerHistorialGeneralComponent },
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

