export interface AlertDTO {
  id?: number;
  idUser: number;
  idProduct: number;
  viewed?: boolean;
  createdAt?: string;
  tipo?: string;
}

export interface ShowAlertDTO {
  id: number;
  idUser: number;
  idProduct: number;
  viewed: boolean;
  createdAt: string;
  productName?: string;
  productPrice?: number;
  productImage?: string;
  tipo?: string;
  // Campos alternativos del backend
  id_producto?: number;
  nombre_producto?: string;
  fecha_creacion?: string;
  id_usuario?: number;
} 