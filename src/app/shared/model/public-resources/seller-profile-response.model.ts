export interface SellerProfileResponse {
    id: number;
    nombres: string;
    apellidos: string;
    correo: string;
    rol: string;
    codigo_universitario: string;
    carrera: string;
    ciclo: number;
    universidad?: string;
    foto_url?: string;
    biografia?: string;
    tratos?: number;
    calificacion?: number;
    resena?: string;
    confiabilidad: boolean;
    sin_demoras: boolean;
    buena_atencion: boolean;
    nombreUsuario?: string;
  }


