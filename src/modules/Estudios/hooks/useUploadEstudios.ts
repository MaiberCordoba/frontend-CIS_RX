// src/modules/Estudios/hooks/useUploadEstudios.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadEstudiosJSON } from "../api/EstudiosApi";
import { toast } from "@heroui/react";

export const useUploadEstudios = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadEstudiosJSON, 
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["estudios"] });
      toast.success(`Carga completada: ${data.creados} creados, ${data.actualizados} actualizados`);
    },
    onError: (error: any) => {
      toast.danger("Error al cargar los datos", {
        description: error.response?.data?.error || "Revise que el Excel tenga el formato correcto"
      });
    }
  });
};