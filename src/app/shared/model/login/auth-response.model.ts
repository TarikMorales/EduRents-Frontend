export interface AuthResponse {
    token: string;
    id: number;
    nombres: string;
    apellidos: string;
    correo: string;
    codigoUniversitario: string;
    carrera: string;
    fotoUrl: string;
    ciclo: number;
    rol: string;
}