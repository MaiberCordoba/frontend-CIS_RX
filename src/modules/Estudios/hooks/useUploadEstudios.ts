// src/modules/Estudios/hooks/useUploadEstudios.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadEstudios } from "../api/EstudiosApi";
import { toast } from "@heroui/react";

export const useUploadEstudios = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadEstudios,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["estudios"] });
      toast.success(`Carga completada: ${data.creados} creados, ${data.actualizados} actualizados`);
    },
    onError: () => {
      toast.danger(` Error al cargar el archivo`,{
          description: "revise que el exel tenga los mismos parametros indicados"
      });
    }
  });
};