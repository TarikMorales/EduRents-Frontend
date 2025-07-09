import { ProductResponse } from "../product/product-response.model";
import { UserProfile } from "../profile/user-profile.model";
import { PaymentMethod } from "./payment-method";
import { TransactionStatus } from "./transaction-status";

export interface TransactionDTO {
  id: number;
  producto: ProductResponse;
  usuario: UserProfile;
  metodo_pago: PaymentMethod;
  fecha_transaccion: string;
  estado: TransactionStatus;
  fecha_confirmacion_entrega?: string;
  motivo_reclamo?: string;
}
