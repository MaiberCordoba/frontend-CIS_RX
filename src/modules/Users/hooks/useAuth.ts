import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      localStorage.setItem('token', data.access);
      localStorage.setItem('refresh', data.refresh);
      // reset() // Si pasas el reset de react-hook-form aquí, limpias el formulario
      navigate('/dashboard', { replace: true });
    },
    onError: (error: any) => {
      // Al haber un error, TanStack Query automáticamente pone isPending en false
      // Así el botón vuelve a su estado normal.
      const mensaje = error.response?.data?.detail || "Credenciales incorrectas";
      alert(mensaje);
    }
  });
};