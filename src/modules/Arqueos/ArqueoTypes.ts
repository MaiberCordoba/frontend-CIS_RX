// src/modules/Arqueos/ArqueoTypes.ts
export interface DetalleDenominacion {
  denominacion: number;
  cantidad: number;
}

export interface Transferencia {
  valor: number;
  numero_factura: string;
}

export interface ArqueoRequest {
  usuario_id: number;
  responsable_nombre: string;
  total_facturado: number;
  detalles: DetalleDenominacion[];
  transferencias: Transferencia[];
  observaciones?: string;  // agregado
}

export interface ArqueoResponse {
  id: number;
  usuario_id: number;
  responsable_nombre: string;
  total_facturado: number;
  total_transferencias: number;
  total_efectivo_fisico: number;
  gran_total_real: number;
  diferencia: number;
  fecha: string;
  hora: string;
  detalles: DetalleDenominacion[];
  transferencias: Transferencia[];
  observaciones: string | null;
  base_efectivo: string;
  usuario: number | null;
}