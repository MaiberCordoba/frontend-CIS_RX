import baseApi from "../../../api/baseApi";
import { LoginResponse } from "../types";

export const loginRequest = async (data: any): Promise<LoginResponse> => {
  const response = await baseApi.post<LoginResponse>('login/', data);
  return response.data;
};