// src/modules/Estudios/hooks/useEstudios.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEstudios, createEstudio, updateEstudio } from "../api/EstudiosApi";
import { useState } from "react";
import { Estudio } from "../EstudiosType";
import { toast } from "@heroui/react";

export const useEstudios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["estudios", searchTerm],
    queryFn: () => getEstudios(searchTerm),
  });

  const createMutation = useMutation({
    mutationFn: createEstudio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estudios"] });
      toast.success("Estudio creado", {
        description: "El estudio ha sido creado exitosamente",
      });
    },
    onError: (error: any) => {
      const mensaje = error.response?.data?.detail || error.response?.data?.message || "Error al crear el estudio";
      toast.danger("Error", { description: mensaje });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; estudio: Partial<Estudio> }) =>
      updateEstudio(data.id, data.estudio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estudios"] });
      toast.success("Estudio actualizado", {
        description: "Los datos del estudio han sido actualizados",
      });
    },
    onError: (error: any) => {
      const mensaje = error.response?.data?.detail || error.response?.data?.message || "Error al actualizar el estudio";
      toast.danger("Error", { description: mensaje });
    },
  });

  return {
    ...query,
    searchTerm,
    setSearchTerm,
    createEstudio: createMutation.mutate,
    updateEstudio: updateMutation.mutate,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
};