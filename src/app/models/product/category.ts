import { CategoriesProducts } from './categories-products';

export interface Category {
  id: number;
  nombre: string;
  productos?: CategoriesProducts[];
}
