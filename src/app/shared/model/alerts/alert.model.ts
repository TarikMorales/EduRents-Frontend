export interface AlertDTO {
  id?: number;
  idUser: number;
  idProduct: number;
  viewed?: boolean;
  createdAt?: string;
}

export interface ShowAlertDTO {
  id: number;
  idUser: number;
  idProduct: number;
  viewed: boolean;
  createdAt: string;
  productName: string;
  productPrice: number;
  productImage?: string;
} 