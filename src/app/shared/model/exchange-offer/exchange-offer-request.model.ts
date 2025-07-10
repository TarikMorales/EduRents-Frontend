export interface ExchangeOfferRequest {
  id_usuario: number;
  id_producto: number;
  mensaje_propuesta: string;
  estado?: string;
}