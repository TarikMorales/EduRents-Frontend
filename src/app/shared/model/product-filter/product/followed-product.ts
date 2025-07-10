import { User } from '../user/user';
import { Product } from './producto';

export interface FollowedProduct {
  id: number;
  usuario: User;
  producto: Product;
  fecha_inicio_seguimiento: string;
}
