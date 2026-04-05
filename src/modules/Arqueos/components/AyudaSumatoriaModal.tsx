// src/modules/Arqueos/components/AyudaSumatoriaModal.tsx
import { useState, useEffect } from "react";
import { Button, Input, Label } from "@heroui/react";
import { AppModal } from "../../../components/global/AppModal";
import { Trash2, Plus } from "lucide-react";

const valoresComunes = [3350, 5000, 5350, 6170, 20100];

interface HistorialItem {
  id: string;
  valor: number;
}

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  totalFacturadoInicial: number;
  onTotalFacturadoChange: (total: number) => void;
}

export const AyudaSumatoriaModal = ({
  isOpen,
  onOpenChange,
  totalFacturadoInicial,
  onTotalFacturadoChange,
}: Props) => {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [valorPersonalizado, setValorPersonalizado] = useState("");
  const [totalFacturado, setTotalFacturado] = useState(totalFacturadoInicial);

  useEffect(() => {
    setTotalFacturado(totalFacturadoInicial);
  }, [totalFacturadoInicial]);

  const agregarValor = (valor: number) => {
    setHistorial((prev) => [...prev, { id: crypto.randomUUID(), valor }]);
  };

  const eliminarItem = (id: string) => {
    setHistorial((prev) => prev.filter((item) => item.id !== id));
  };

  const totalManual = historial.reduce((sum, item) => sum + item.valor, 0);

  const resetear = () => {
    setHistorial([]);
    setValorPersonalizado("");
  };

  const handleClose = (close: () => void) => {
    // Sincronizar el total facturado al cerrar
    onTotalFacturadoChange(totalFacturado);
    close();
  };

  return (
    <AppModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Ayuda: Sumatoria de facturas en efectivo"
    >
      {((close) => (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-default-600">
            Agrega aquí los valores de las facturas marcadas como "efectivo"
            para obtener el total manual.
          </p>

          {/* Botones rápidos */}
          <div className="flex flex-wrap gap-2">
            {valoresComunes.map((val) => (
              <Button key={val} size="sm" onPress={() => agregarValor(val)}>
                +${val.toLocaleString()}
              </Button>
            ))}
          </div>

          {/* Valor personalizado */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 flex flex-col gap-1">
              <Label htmlFor="valorPersonalizado">Otro valor</Label>
              <Input
                id="valorPersonalizado"
                type="number"
                placeholder="Ej: 12300"
                value={valorPersonalizado}
                onChange={(e) => setValorPersonalizado(e.target.value)}
              />
            </div>
            <Button
              onPress={() => {
                const num = parseFloat(valorPersonalizado);
                if (!isNaN(num) && num > 0) {
                  agregarValor(num);
                  setValorPersonalizado("");
                }
              }}
            >
              <Plus size={16} /> Agregar
            </Button>
          </div>

          {/* Historial */}
          {historial.length > 0 && (
            <div className="border rounded-xl p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Historial de sumas:</span>
                <Button size="sm" variant="ghost" onPress={resetear}>
                  Reiniciar
                </Button>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {historial.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span>${item.valor.toLocaleString()}</span>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="ghost"
                      onPress={() => eliminarItem(item.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                <span>Total acumulado manual:</span>
                <span>${totalManual.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Total facturado sistema */}
          <div className="border-t pt-4 mt-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="totalFacturadoSistema">Total facturado (sistema)</Label>
              <Input
                id="totalFacturadoSistema"
                type="number"
                value={totalFacturado || ""}
                onChange={(e) => setTotalFacturado(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="ghost" onPress={() => handleClose(close)}>
              Cerrar
            </Button>
          </div>
        </div>
      ))}
    </AppModal>
  );
};