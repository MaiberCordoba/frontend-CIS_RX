// src/modules/Estudios/hooks/useUploadEstudios.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadEstudios } from "../api/EstudiosApi";

export const useUploadEstudios = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadEstudios,
    onSuccess: (data) => {
      // Invalidar la lista de estudios para que refresque
      queryClient.invalidateQueries({ queryKey: ["estudios"] });
      alert(`✅ Carga completada: ${data.creados} creados, ${data.actualizados} actualizados`);
    },
    onError: (error: any) => {
      const mensaje = error.response?.data?.error || "Error al cargar el archivo";
      alert(`❌ Error: ${mensaje}`);
    }
  });
};