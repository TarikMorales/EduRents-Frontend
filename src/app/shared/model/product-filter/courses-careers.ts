import { Course } from './course';
import { Career } from './career';
import { CoursesCareersProduct } from "./product/courses-careers-product";

export interface CoursesCareers {
  id: number;
  curso: Course;
  carrera: Career;
  productos: CoursesCareersProduct[];
}
