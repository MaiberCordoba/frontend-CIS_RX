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

export const deleteEstudio = async (id: number): Promise<void> => {
  await baseApi.delete(`estudio/${id}/`);
};


// src/modules/Estudios/api/EstudiosApi.ts
export const uploadEstudiosJSON = async (estudios: any[]): Promise<any> => {
  const response = await baseApi.post('estudios/carga-masiva-json/', { estudios });
  return response.data;
};