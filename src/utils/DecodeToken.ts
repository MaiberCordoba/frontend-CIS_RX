// src/utils/decodeToken.ts
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  user_id: string;
  exp: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  // exp viene en segundos, Date.now() en milisegundos
  return decoded.exp * 1000 < Date.now();
};