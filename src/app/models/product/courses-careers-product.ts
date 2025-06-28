import { Product } from './producto';
import { CoursesCareers } from '../courses-careers';

export interface CoursesCareersProduct {
  id: number;
  producto: Product;
  curso_carrera: CoursesCareers;
}
