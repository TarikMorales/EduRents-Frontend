import { CoursesCareers } from './courses-careers';

export interface Course {
  id: number;
  nombre: string;
  codigo: string;
  carreras?: CoursesCareers[]; // Opcional
}
