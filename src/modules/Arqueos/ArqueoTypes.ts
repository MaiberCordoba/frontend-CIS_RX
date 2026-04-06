// src/modules/Arqueos/ArqueoTypes.ts

// Para enviar al backend (sin subtotal)
export interface DetalleDenominacionRequest {
  denominacion: number;
  cantidad: number;
}

// Para recibir del backend (con subtotal)
export interface DetalleDenominacionResponse {
  denominacion: number;
  cantidad: number;
  subtotal: number;
}

export interface Transferencia {
  valor: number;
  numero_factura: string;
}

export interface ArqueoRequest {
  usuario_id: number;
  responsable_nombre: string;
  total_facturado: number;
  detalles: DetalleDenominacionRequest[];
  transferencias: Transferencia[];
  observaciones?: string;
}

export interface ArqueoResponse {
  id: number;
  usuario_id: number;
  responsable_nombre: string;
  total_facturado: number;
  total_efectivo_fisico: number;
  total_transferencias: number;
  gran_total_real: number;
  diferencia: number;
  fecha: string;
  hora: string;
  detalles: DetalleDenominacionResponse[];
  transferencias: Transferencia[];
  observaciones: string | null;
  base_efectivo: string;
}