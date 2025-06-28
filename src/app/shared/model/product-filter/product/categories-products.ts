import { Product } from './producto';
import { Category } from './category';

export interface CategoriesProducts {
  id: number;
  categoria: Category;
  producto: Product;
}
