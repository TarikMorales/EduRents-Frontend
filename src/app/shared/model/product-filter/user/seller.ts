import { Product } from '../product/producto';
import { User } from './user';

export interface Seller {
  id: number;
  resena: string;
  confiabilidad: boolean;
  sin_demoras: boolean;
  buena_atencion: boolean;
  productos?: Product[];
  nombreUsuario: User;
}
