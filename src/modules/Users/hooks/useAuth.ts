// src/modules/Users/hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { loginRequest, getMe } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth as useAuthContext } from "@/context/AuthContext";

export const useAuth = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: async (data) => {
      const { access, refresh } = data;
      
      // Guardar tokens temporalmente para poder llamar a /me/
      localStorage.setItem('token', access);
      localStorage.setItem('refresh', refresh);
      
      try {
        const userData = await getMe();
        // Guardar todo en el contexto y localStorage
        login(access, refresh, userData);
      } catch (error) {
        console.error('Error al obtener perfil:', error);
        // Si falla, al menos guardamos los tokens
        login(access, refresh);
      }
      
      navigate('/arqueo', { replace: true });
    },
  });
};