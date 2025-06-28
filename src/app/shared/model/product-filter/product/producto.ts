import { ProductStatus } from './product-status.enum';
import { Seller } from '../user/seller';
import { Image } from './image';
import { CategoriesProducts } from './categories-products';
import { CoursesCareersProduct } from './courses-careers-product';
import { Transaction } from '../transfers/transaction';
import { ExchangeOffer } from '../exchanges/exchange-offer';
import { FollowedProduct } from './followed-product';

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: ProductStatus;
  fecha_creacion: string;
  fecha_modificacion?: string;
  fecha_expiracion?: string;
  cantidad_disponible: number;
  acepta_intercambio: boolean;
  vistas?: number;
  vendedor: Seller;
  imagenes?: Image[];
  categorias: CategoriesProducts[];
  cursos_carreras?: CoursesCareersProduct[];
  transacciones?: Transaction[];
  intercambios?: ExchangeOffer[];
  usuarios_siguiendo?: FollowedProduct[];
}
