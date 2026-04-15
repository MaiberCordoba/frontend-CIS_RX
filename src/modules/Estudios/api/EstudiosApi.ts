import baseApi from "../../../api/baseApi";
import { Estudio } from "../EstudiosType";

export const getEstudios = async (search: string = ""): Promise<Estudio[]> => {
  // Si search tiene algo, lo enviamos, si no, trae todo.
  const response = await baseApi.get<Estudio[]>(`estudio/?search=${search}`);
  return response.data;
};

export const createEstudio = async (data: Partial<Estudio>) => {
  return await baseApi.post('estudio/', data);
};

export const updateEstudio = async (id: number, data: Partial<Estudio>) => {
  return await baseApi.put(`estudio/${id}/`, data);
};

export const uploadEstudios = async (file: File): Promise<{ creados: number; actualizados: number; total: number }> => {
  const formData = new FormData();
  formData.append('archivo', file);
  const response = await baseApi.post('estudios/carga-masiva/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};


// src/modules/Estudios/api/EstudiosApi.ts
export const uploadEstudiosJSON = async (estudios: any[]): Promise<any> => {
  const response = await baseApi.post('estudios/carga-masiva-json/', { estudios });
  return response.data;
};