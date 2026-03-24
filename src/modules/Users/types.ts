export interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  rol: 'Facturador' | 'Jefe';
  telefono?: string;
}

export interface LoginResponse {
  access: string;  // El token JWT
  refresh: string;
}