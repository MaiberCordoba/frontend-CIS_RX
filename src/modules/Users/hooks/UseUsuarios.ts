import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../api/authApi';
import { Usuario } from '../types';
import { toast } from '@heroui/react';

export const useUsuarios = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['usuarios'],
    queryFn: getUsuarios,
  });

  const createMutation = useMutation({
    mutationFn: createUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuario creado', {
        description: 'El usuario ha sido creado exitosamente',
      });
    },
    onError: (error: any) => {
      const mensaje = error.response?.data?.detail || 'Error al crear el usuario';
      toast.danger('Error', { description: mensaje });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Usuario> }) => updateUsuario(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuario actualizado', {
        description: 'Los datos del usuario han sido actualizados',
      });
    },
    onError: (error: any) => {
      const mensaje = error.response?.data?.detail || 'Error al actualizar el usuario';
      toast.danger('Error', { description: mensaje });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuario eliminado', {
        description: 'El usuario ha sido eliminado correctamente',
      });
    },
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