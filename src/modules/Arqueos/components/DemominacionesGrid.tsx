// src/modules/Arqueos/components/DenominacionesGrid.tsx
import { Input, Label } from "@heroui/react";
import { denominacionesList } from "../data/denominaciones";

interface Props {
  valores: { [denominacion: number]: number };
  onChange: (denominacion: number, cantidad: number) => void;
}

export const DenominacionesGrid = ({ valores, onChange }: Props) => {
  const handleChange = (denominacion: number, valorStr: string) => {
    // Permitir vacío para que el usuario pueda borrar
    if (valorStr === "") {
      onChange(denominacion, 0);
      return;
    }
    const num = parseInt(valorStr, 10);
    if (!isNaN(num) && num >= 0) {
      onChange(denominacion, num);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {denominacionesList.map((den) => (
        <div key={den.valor} className="flex flex-col gap-1">
          <Label htmlFor={`denom-${den.valor}`}>{den.nombre}</Label>
          <Input
            id={`denom-${den.valor}`}
            type="number"
            min={0}
            value={valores[den.valor] === 0 ? "" : valores[den.valor]}
            onChange={(e) => handleChange(den.valor, e.target.value)}
            placeholder="0"
          />
        </div>
      ))}
    </div>
  );
};