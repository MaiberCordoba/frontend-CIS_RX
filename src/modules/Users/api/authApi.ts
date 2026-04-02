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