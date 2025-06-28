export interface ExchangeOfferResponse {
  id: number;
  idSolicitante: number;
  idProductoSolicitado: number;
  productoSolicitadoNombre: string;
  productoSolicitadoImagenUrl?: string;
  idProductoOfrecido: number;
  productoOfrecidoNombre: string;
  productoOfrecidoImagenUrl?: string;
  estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'CANCELADA';
  fechaCreacion: Date;
}