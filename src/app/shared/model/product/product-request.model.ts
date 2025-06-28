import { ProductStatus } from "./product-status";

export interface ProductRequest {
    id_vendedor: number;
    nombre: string;
    descripcion: string;
    precio: number;
    estado: ProductStatus;
    cantidad_disponible: number;
    acepta_intercambio: boolean;
    fecha_expiracion: string;
    urls_imagenes: string[];
    categorias: number[];
    cursos_carreras: number[];
}