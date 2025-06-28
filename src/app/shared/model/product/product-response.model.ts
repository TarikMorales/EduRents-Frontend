import { UserSeller } from "../profile/user-seller.model";
import { Category } from "./category.model";
import { CourseCareer } from "./course-career.model";
import { Image } from "./image.model";
import { ProductStatus } from "./product-status";

export interface ProductResponse {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    estado: ProductStatus;
    cantidad_disponible: number;
    acepta_intercambio: boolean;
    fecha_creacion: string;
    fecha_modificacion: string;
    fecha_expiracion: string;
    vistas: number;
    vendedor: UserSeller;
    imagenes: Image[];
    categorias: Category[];
    cursos_carreras: CourseCareer[];
}