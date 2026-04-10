import baseApi from "../../../api/baseApi";
import { LoginResponse, Usuario } from "../types";

export const loginRequest = async (data: any): Promise<LoginResponse> => {
  const response = await baseApi.post<LoginResponse>('login/', data);
  return response.data;
};

export const getMe = async (): Promise<Usuario> => {
  const response = await baseApi.get<Usuario>('usuarios/me/'); // Ajusta la ruta si es diferente
  return response.data;
};

export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await baseApi.get<Usuario[]>('usuarios/');
  return response.data;
};

export const createUsuario = async (data: Omit<Usuario, 'id'>): Promise<Usuario> => {
  const response = await baseApi.post<Usuario>('usuarios/', data);
  return response.data;
};

export const updateUsuario = async (id: number, data: Partial<Usuario>): Promise<Usuario> => {
  const response = await baseApi.patch<Usuario>(`usuarios/${id}/`, data);
  return response.data;
};

export const deleteUsuario = async (id: number): Promise<void> => {
  await baseApi.delete(`usuarios/${id}/`);
};