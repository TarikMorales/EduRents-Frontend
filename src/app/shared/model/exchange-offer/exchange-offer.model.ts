import { ExchangeStatus } from "../product-filter/exchanges/exchange-status.enum";
import { User } from "../product-filter/user/user";
import { ProductResponse } from "../product/product-response.model";

export interface ExchangeOfferResponse {
  id: number;
  usuario: User;
  producto: ProductResponse;
  mensaje_propuesta: string;
  estado: ExchangeStatus;
}
