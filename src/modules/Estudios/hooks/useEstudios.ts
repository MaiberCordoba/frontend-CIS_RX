import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEstudios, createEstudio, updateEstudio } from "../api/EstudiosApi";
import { useState } from "react";
import { Estudio } from "../EstudiosType";

export const useEstudios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["estudios", searchTerm],
    queryFn: () => getEstudios(searchTerm),
  });

  const createMutation = useMutation({
    mutationFn: createEstudio,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["estudios"] }),
  });

  const updateMutation = useMutation({
    mutationFn: (data: {id: number, estudio: Partial<Estudio>}) => updateEstudio(data.id, data.estudio),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["estudios"] }),
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