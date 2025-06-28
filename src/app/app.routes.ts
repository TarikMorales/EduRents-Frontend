
import { LandingComponent } from './pages/public_/landing/landing.component';
import { CreateTransactionComponent } from './pages/user/transactions/create-transaction/create-transaction.component';
import { CreatePaymentCardComponent } from './pages/user/transactions/create-payment-card/create-payment-card.component';
import { TransaccionGuardadaVirtualComponent } from './pages/user/transactions/transaccion-guardada-virtual/transaccion-guardada-virtual.component';
import { TransaccionEfectivoComponent } from './pages/user/transactions/transaccion-efectivo/transaccion-efectivo.component';
import { PagoConfirmadoComponent } from './pages/user/transactions/pago-confirmado/pago-confirmado.component';
import { ReclamarEntregaComponent } from './pages/user/transactions/reclamar-entrega/reclamar-entrega.component';
import { HistorialPagosComponent } from './pages/user/transactions/historial-pagos/historial-pagos.component';
import { SellerHistorialPagosComponent } from './pages/seller/transactions/seller-historial-pagos/seller-historial-pagos.component';
import { GooglePayComponent } from './pages/user/transactions/google-pay/google-pay.component';
import { ApplePayComponent } from './pages/user/transactions/apple-pay/apple-pay.component';
import { BancaComponent } from './pages/user/transactions/banca/banca.component';
import { TransaccionCanceladaComponent } from './pages/user/transactions/transaccion-cancelada/transaccion-cancelada.component';
import { ReclamoEnviadoComponent } from './pages/user/transactions/reclamo-enviado/reclamo-enviado.component';
import { HistorialGeneralComponent } from './pages/user/historial-general/historial-general.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SellerHistorialGeneralComponent } from './pages/seller/seller-historial-general/seller-historial-general.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
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
  { path: 'auth/login', component: LoginComponent},
  { path: 'reclamo-enviado', component: ReclamoEnviadoComponent},
  { path: 'mi-historial', component: HistorialGeneralComponent },
  { path: 'seller/historial', component: SellerHistorialGeneralComponent }

];
