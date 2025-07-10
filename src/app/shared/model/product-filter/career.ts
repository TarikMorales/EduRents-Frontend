import { CoursesCareers } from './courses-careers';
import { User } from './user/user';

export interface Career {
  id: number;
  nombre: string;
  codigo: string;
  cursos: CoursesCareers[];
  usuarios: User[];
}
