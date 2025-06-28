export interface TransactionDTO {
  id: number;
  idProducto: number;
  precio: number;
  metodoPago: string;
  estado: string;
  fechaCreacion: string;
  nombreProducto?: string;
  nombreVendedor?: string;
  imagenProducto?: string;
}
