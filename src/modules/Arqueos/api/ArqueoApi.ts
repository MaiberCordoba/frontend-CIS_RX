// src/modules/Arqueos/api/arqueoApi.ts
import baseApi from '../../../api/baseApi';
import { ArqueoRequest, ArqueoResponse } from '../ArqueoTypes';

export const crearArqueo = async (data: ArqueoRequest): Promise<ArqueoResponse> => {
  const response = await baseApi.post<ArqueoResponse>('arqueo/', data);
  return response.data;
};