// src/modules/Arqueos/components/AyudaSumatoriaModal.tsx
import { useState, useEffect, useRef } from "react";
import { Button, Input, Label } from "@heroui/react";
import { AppModal } from "../../../components/global/AppModal";
import { Trash2, Plus, Pencil, Check, X } from "lucide-react";

const valoresComunes = [3350, 5000, 5350, 6170, 20100, 6700];

interface HistorialItem {
  id: string;
  valor: number;
  editando?: boolean;
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
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar con el valor inicial del padre
  useEffect(() => {
    setTotalFacturado(totalFacturadoInicial);
  }, [totalFacturadoInicial]);

  // Calcular total manual del historial
  const totalManual = historial.reduce((sum, item) => sum + item.valor, 0);

  // Actualizar totalFacturado automáticamente cuando cambie el historial
  useEffect(() => {
    setTotalFacturado(totalManual);
  }, [totalManual]);

  const agregarValor = (valor: number) => {
    setHistorial((prev) => [...prev, { id: crypto.randomUUID(), valor }]);
  };

  const eliminarItem = (id: string) => {
    setHistorial((prev) => prev.filter((item) => item.id !== id));
  };

  const iniciarEdicion = (id: string) => {
    setHistorial((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, editando: true } : item
      )
    );
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const guardarEdicion = (id: string, nuevoValor: number) => {
    if (isNaN(nuevoValor) || nuevoValor <= 0) return;
    setHistorial((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, valor: nuevoValor, editando: false } : item
      )
    );
  };

  const cancelarEdicion = (id: string) => {
    setHistorial((prev) =>
      prev.map((item) => (item.id === id ? { ...item, editando: false } : item))
    );
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, id: string, valorActual: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      guardarEdicion(id, valorActual);
    } else if (e.key === "Escape") {
      cancelarEdicion(id);
    }
  };

  const resetear = () => {
    setHistorial([]);
    setValorPersonalizado("");
  };

  const handleAgregarPersonalizado = () => {
    const num = parseFloat(valorPersonalizado);
    if (!isNaN(num) && num > 0) {
      agregarValor(num);
      setValorPersonalizado("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAgregarPersonalizado();
    }
  };

  const handleClose = (close: () => void) => {
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
              <Button
                className="bg-primary text-white"
                key={val}
                size="sm"
                onPress={() => agregarValor(val)}
              >
                +${val.toLocaleString()}
              </Button>
            ))}
          </div>

          {/* Valor personalizado con Enter */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 flex flex-col gap-1">
              <Label htmlFor="valorPersonalizado">Otro valor</Label>
              <Input
                ref={inputRef}
                id="valorPersonalizado"
                type="number"
                placeholder="Ej: 12300"
                value={valorPersonalizado}
                onChange={(e) => setValorPersonalizado(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button
              className="bg-primary text-white"
              isIconOnly
              onPress={handleAgregarPersonalizado}
            >
              <Plus size={16} />
            </Button>
          </div>

          {/* Historial con edición sin borde azul */}
          {historial.length > 0 && (
            <div className="border rounded-xl p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Historial de sumas:</span>
                <Button size="sm" variant="ghost" onPress={resetear}>
                  Reiniciar
                </Button>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {historial.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-2">
                    {item.editando ? (
                      <div className="flex-1 flex gap-2 items-center">
                        <Input
                          ref={editInputRef}
                          type="number"
                          defaultValue={item.valor}
                          className="flex-1 focus:outline-none focus:ring-0 outline-none"
                          onKeyDown={(e) => handleEditKeyDown(e, item.id, parseFloat(e.currentTarget.value) || 0)}
                          autoFocus
                        />
                        <Button
                          isIconOnly
                          size="sm"
                          onPress={() => {
                            const nuevoValor = parseFloat(editInputRef.current?.value || "0");
                            guardarEdicion(item.id, nuevoValor);
                          }}
                        >
                          <Check size={14} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          onPress={() => cancelarEdicion(item.id)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1">${item.valor.toLocaleString()}</span>
                        <div className="flex gap-1">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="ghost"
                            onPress={() => iniciarEdicion(item.id)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="ghost"
                            onPress={() => eliminarItem(item.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total facturado (editable y sincronizado con el historial) */}
          <div className="border-t pt-4 mt-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="totalFacturadoSistema">
                Total facturado (facturas en efectivo)
              </Label>
              <Input
                id="totalFacturadoSistema"
                placeholder="0"
                type="number"
                value={totalFacturado === 0 ? "" : totalFacturado}
                onChange={(e) => setTotalFacturado(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="danger" onPress={() => handleClose(close)}>
              Cerrar
            </Button>
          </div>
        </div>
      ))}
    </AppModal>
  );
};