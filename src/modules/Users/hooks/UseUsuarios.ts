import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../api/authApi';
import { Usuario } from '../types';

export const useUsuarios = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['usuarios'],
    queryFn: getUsuarios,
  });

  const createMutation = useMutation({
    mutationFn: createUsuario,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Usuario> }) => updateUsuario(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUsuario,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  });

  return {
    ...query,
    createUsuario: createMutation.mutate,
    updateUsuario: updateMutation.mutate,
    deleteUsuario: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};