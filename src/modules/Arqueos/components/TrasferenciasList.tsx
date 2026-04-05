// src/modules/Arqueos/components/TransferenciasList.tsx
import { Button, Input, Label } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { Transferencia } from "../ArqueoTypes";

interface Props {
  transferencias: Transferencia[];
  onChange: (transferencias: Transferencia[]) => void;
}

export const TransferenciasList = ({ transferencias, onChange }: Props) => {
  const agregar = () => {
    onChange([...transferencias, { valor: 0, numero_factura: "" }]);
  };

  const actualizar = (index: number, campo: keyof Transferencia, valor: string | number) => {
    const nuevas = [...transferencias];
    nuevas[index] = { ...nuevas[index], [campo]: valor };
    onChange(nuevas);
  };

  const eliminar = (index: number) => {
    const nuevas = transferencias.filter((_, i) => i !== index);
    onChange(nuevas);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" onPress={agregar}>
          Agregar transferencia
        </Button>
      </div>
      {transferencias.length === 0 && (
        <p className="text-sm text-default-500 text-center">No hay transferencias</p>
      )}
      <div className="space-y-3">
        {transferencias.map((t, idx) => (
          <div key={idx} className="flex flex-col gap-2 p-3 border rounded-xl">
            <div className="flex flex-col gap-1">
              <Label htmlFor={`transferencia-valor-${idx}`}>Valor</Label>
              <Input
                id={`transferencia-valor-${idx}`}
                type="number"
                placeholder="0"
                value={t.valor || ""}
                onChange={(e) => actualizar(idx, "valor", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor={`transferencia-factura-${idx}`}>N° Factura</Label>
              <Input
                id={`transferencia-factura-${idx}`}
                placeholder="Ej: 001-123"
                value={t.numero_factura}
                onChange={(e) => actualizar(idx, "numero_factura", e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                onPress={() => eliminar(idx)}
                aria-label="Eliminar transferencia"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};