// src/modules/Arqueos/components/AyudaVueltasModal.tsx
import { useState } from "react";
import { Button, Input, Label, Card } from "@heroui/react";
import { AppModal } from "../../../components/global/AppModal";
import { Banknote, Coins } from "lucide-react";
import { denominacionesList } from "../data/denominaciones";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AyudaVueltasModal = ({ isOpen, onOpenChange }: Props) => {
  const [totalPagar, setTotalPagar] = useState<number>(0);
  const [montoRecibido, setMontoRecibido] = useState<number>(0);

  const cambio = montoRecibido - totalPagar;
  const cambioPositivo = cambio >= 0;

  // Calcular desglose óptimo del cambio
  const calcularDesglose = (monto: number) => {
    if (monto <= 0) return [];
    let restante = monto;
    const desglose: { valor: number; cantidad: number; tipo: string; nombre: string }[] = [];
    const sorted = [...denominacionesList].sort((a, b) => b.valor - a.valor);
    for (const den of sorted) {
      if (restante >= den.valor) {
        const cantidad = Math.floor(restante / den.valor);
        desglose.push({
          valor: den.valor,
          cantidad,
          tipo: den.tipo,
          nombre: den.nombre,
        });
        restante -= cantidad * den.valor;
      }
    }
    return desglose;
  };

  const desgloseCambio = calcularDesglose(cambioPositivo ? cambio : 0);
  const billetes = desgloseCambio.filter((item) => item.tipo === "billete");
  const monedas = desgloseCambio.filter((item) => item.tipo === "moneda");

  const limpiar = () => {
    setTotalPagar(0);
    setMontoRecibido(0);
  };

  return (
    <AppModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Calculadora de vueltas (cambio)"
    >
      {((close) => (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-default-600">
            Calcula el cambio exacto a devolver. Ingresa el total a pagar y el monto recibido.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="totalPagar">Total a pagar</Label>
              <Input
                id="totalPagar"
                type="number"
                placeholder="0"
                value={totalPagar === 0 ? "" : totalPagar}
                onChange={(e) => setTotalPagar(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="montoRecibido"> Monto recibido</Label>
              <Input
                id="montoRecibido"
                type="number"
                placeholder="0"
                value={montoRecibido === 0 ? "" : montoRecibido}
                onChange={(e) => setMontoRecibido(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              onPress={limpiar}
            >
              Limpiar
            </Button>
          </div>

          {totalPagar > 0 && montoRecibido > 0 && (
            <Card className={`p-4 ${!cambioPositivo ? "bg-danger-50 border-danger-200" : "bg-primary-50 border-primary-200"}`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Cambio a devolver:</span>
                  <span className={`font-bold text-2xl ${cambioPositivo ? "text-primary" : "text-danger"}`}>
                    {cambioPositivo ? `$${cambio.toLocaleString()}` : "Monto insuficiente"}
                  </span>
                </div>

                {cambioPositivo && (billetes.length > 0 || monedas.length > 0) && (
                    <div className="border-t pt-3">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Billetes */}
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-default-700 mb-2">
                          <Banknote size={16} /> Billetes
                        </div>
                        <div className="space-y-2">
                          {billetes.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white rounded-lg px-3 py-2 shadow-sm">
                              <span className="font-medium">{item.nombre}</span>
                              <span className="font-mono font-bold text-primary">{item.cantidad} ×</span>
                            </div>
                          ))}
                          {billetes.length === 0 && (
                            <div className="text-sm text-default-400">No hay billetes</div>
                          )}
                        </div>
                      </div>
                      {/* Monedas */}
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-default-700 mb-2">
                          <Coins size={16} /> Monedas
                        </div>
                        <div className="space-y-2">
                          {monedas.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white rounded-lg px-3 py-2 shadow-sm">
                              <span className="font-medium">{item.nombre}</span>
                              <span className="font-mono font-bold text-primary">{item.cantidad} ×</span>
                            </div>
                          ))}
                          {monedas.length === 0 && (
                            <div className="text-sm text-default-400">No hay monedas</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            )}

            <div className="flex justify-end gap-2 mt-2">
                <Button variant="danger" onPress={close}>
                    Cerrar
                </Button>
            </div>
        </div>
      ))}
    </AppModal>
  );
};