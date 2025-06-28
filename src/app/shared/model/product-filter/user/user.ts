import { Role } from './role';
import { Seller } from './seller';
import { Career } from '../career';
import { Transaction } from '../transfers/transaction';
import { ExchangeOffer } from '../exchanges/exchange-offer';
import { FollowedProduct } from '../product/followed-product';

export interface User {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  codigo_universitario: string;
  ciclo: number;
  foto_url: string;
  rol: Role;
  vendedor?: Seller;
  carrera: Career;
  transacciones?: Transaction[];
  intercambios?: ExchangeOffer[];
  productos_seguidos?: FollowedProduct[];
}
