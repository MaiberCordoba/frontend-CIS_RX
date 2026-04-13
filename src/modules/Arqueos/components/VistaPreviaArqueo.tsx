// src/modules/Arqueos/components/VistaPreviaArqueo.tsx
import { Button, Label } from "@heroui/react";
import { AppModal } from "../../../components/global/AppModal";
import { denominacionesList } from "../data/denominaciones";
import { Transferencia } from "../ArqueoTypes";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  responsableNombre: string;
  totalFacturado: number;
  totalEfectivoFisico: number;
  totalTransferencias: number;
  granTotalReal: number;
  diferencia: number;
  detalles: { [key: number]: number };
  transferencias: Transferencia[];
  observaciones: string;
  onConfirm: () => void;
  isSaving: boolean;
}

export const VistaPreviaArqueo = ({
  isOpen,
  onOpenChange,
  responsableNombre,
  totalFacturado,
  totalEfectivoFisico,
  totalTransferencias,
  granTotalReal,
  diferencia,
  detalles,
  transferencias,
  observaciones,
  onConfirm,
  isSaving,
}: Props) => {
  // Filtrar solo denominaciones con cantidad > 0
  const detallesActivos = denominacionesList.filter(
    (den) => (detalles[den.valor] || 0) > 0
  );

  return (
    <AppModal isOpen={isOpen} onOpenChange={onOpenChange} title="Vista previa del arqueo">
      {((close) => (
        <div className="space-y-4">
          {/* Responsable */}
          <div className="flex flex-col gap-1">
            <Label>Responsable</Label>
            <span className="text-sm font-medium">{responsableNombre}</span>
          </div>

          <hr className="border-default-200" />

          {/* Desglose de efectivo físico - más ordenado */}
          {detallesActivos.length > 0 && (
            <div>
              <Label>Desglose de efectivo físico</Label>
              <div className="space-y-1 mt-2">
                {detallesActivos.map((den) => {
                  const cantidad = detalles[den.valor];
                  const subtotal = den.valor * cantidad;
                  return (
                    <div key={den.valor} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{den.nombre}</span>
                      <span className="font-mono">
                        {cantidad} x ${den.valor.toLocaleString()} = ${subtotal.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
                <div className="flex justify-between font-bold pt-2 border-t mt-2">
                  <span>Total efectivo físico:</span>
                  <span>${totalEfectivoFisico.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Transferencias */}
          {transferencias.length > 0 && (
            <>
              <hr className="border-default-200" />
              <div>
                <Label>Transferencias</Label>
                <div className="space-y-1 mt-2">
                  {transferencias.map((t, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>Factura {t.numero_factura}</span>
                      <span>${t.valor.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total transferencias:</span>
                    <span>${totalTransferencias.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <hr className="border-default-200" />

          {/* Totales y diferencia */}
          <div className="space-y-2">
            <div className="flex justify-between text-base font-bold">
              <span>Gran total real (efectivo + transferencias):</span>
              <span>${granTotalReal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Total facturado (sistema):</span>
              <span>${totalFacturado.toLocaleString()}</span>
            </div>
            <div
              className={`flex justify-between text-base font-bold ${
                diferencia >= 0 ? "text-success" : "text-danger"
              }`}
            >
              <span>Diferencia (real - facturado):</span>
              <span>{diferencia >= 0 ? `+${diferencia.toLocaleString()}` : diferencia.toLocaleString()}</span>
            </div>
          </div>

          {observaciones && (
            <>
              <hr className="border-default-200" />
              <div>
                <Label>Observaciones</Label>
                <p className="text-sm mt-1 whitespace-pre-wrap">{observaciones}</p>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="danger" onPress={close}>
              Cancelar
            </Button>
            <Button variant="primary" onPress={onConfirm} isDisabled={isSaving}>
              {isSaving ? "Guardando..." : "Confirmar y guardar"}
            </Button>
          </div>

          
        </div>
      ))}
    </AppModal>
  );
};