import { ExchangeStatus } from './exchange-status.enum';
import { Product } from '../product/producto';
import { User } from '../user/user';

export interface ExchangeOffer {
  id: number;
  mensaje_propuesta: string;
  estado: ExchangeStatus;
  producto: Product;
  usuario: User;
}
