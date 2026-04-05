// src/modules/Arqueos/hooks/useArqueo.ts
import { useMutation } from '@tanstack/react-query';
import { crearArqueo } from '../api/ArqueoApi';
import { ArqueoRequest } from '../ArqueoTypes';

export const useArqueo = () => {
  return useMutation({
    mutationFn: (data: ArqueoRequest) => crearArqueo(data),
    onSuccess: (data) => {
      console.log('Arqueo creado con éxito:', data);
      // Aquí puedes mostrar un toast o redirigir
    },
    onError: (error: any) => {
      console.error('Error al crear arqueo:', error);
      alert(error.response?.data?.message || 'Error al guardar el arqueo');
    },
  });
};