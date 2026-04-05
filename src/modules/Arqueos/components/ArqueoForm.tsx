// src/modules/Arqueos/components/ArqueoForm.tsx
import { useEffect, useState } from "react";
import { Button, Card, Input, Label, TextArea, TextField } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { useArqueo } from "../hooks/UseArqueo";
import { DenominacionesGrid } from "./DemominacionesGrid";
import { TransferenciasList } from "./TrasferenciasList";
import { AyudaSumatoriaModal } from "./AyudaSumatoriaModal";
import { VistaPreviaArqueo } from "./VistaPreviaArqueo";
import { denominacionesList } from "../data/denominaciones";
import { ArqueoRequest, Transferencia } from "../ArqueoTypes";

export const ArqueoForm = () => {
  const { user } = useAuth();
  const { mutate, isPending, data: arqueoCreado } = useArqueo();

  const [responsableNombre, setResponsableNombre] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [detalles, setDetalles] = useState<{ [key: number]: number }>(() => {
    const initial: { [key: number]: number } = {};
    denominacionesList.forEach((d) => (initial[d.valor] = 0));
    return initial;
  });
  const [transferencias, setTransferencias] = useState<Transferencia[]>([]);
  const [isAyudaOpen, setIsAyudaOpen] = useState(false);
  const [isVistaPreviaOpen, setIsVistaPreviaOpen] = useState(false);
  const [totalFacturado, setTotalFacturado] = useState(0);

  const totalEfectivoFisico = Object.entries(detalles).reduce(
    (sum, [denominacion, cantidad]) => sum + parseInt(denominacion) * cantidad,
    0
  );
  const totalTransferencias = transferencias.reduce((sum, t) => sum + (t.valor || 0), 0);
  const granTotalReal = totalEfectivoFisico + totalTransferencias;
  const diferencia = granTotalReal - totalFacturado;

   useEffect(() => {
    if (arqueoCreado) {
      alert("Arqueo guardado exitosamente");
      // Opcional: resetear formulario
      setResponsableNombre("");
      setObservaciones("");
      setDetalles(() => {
        const initial: { [key: number]: number } = {};
        denominacionesList.forEach((d) => (initial[d.valor] = 0));
        return initial;
      });
      setTransferencias([]);
      setTotalFacturado(0);
    }
  }, [arqueoCreado]);

  const handleSubmit = () => {
    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }
    if (!responsableNombre.trim()) {
      alert("Ingresa el nombre del responsable");
      return;
    }
    if (totalFacturado <= 0) {
      alert("Ingresa el total facturado del día (según el sistema de facturación)");
      return;
    }
    setIsVistaPreviaOpen(true);
  };

  const confirmarGuardado = () => {
    if (!user) return;
    const data: ArqueoRequest = {
      usuario_id: user.id,
      responsable_nombre: responsableNombre,
      total_facturado: totalFacturado,
      detalles: Object.entries(detalles)
        .filter(([_, cantidad]) => cantidad > 0)
        .map(([denominacion, cantidad]) => ({
          denominacion: parseInt(denominacion),
          cantidad,
        })),
      transferencias: transferencias.filter((t) => t.valor > 0 && t.numero_factura.trim()),
      observaciones,
    };
    mutate(data);
    setIsVistaPreviaOpen(false);
  };

  // Reducir el espacio superior (para acercar al navbar)
  // En la página que contiene este formulario, ajusta el padding-top

  return (
    <div className="flex flex-col gap-6">
      {/* Sección de ayuda (pre-arqueo) */}
      <Card>
        <Card.Header>
          <Card.Title> Validación previa (control interno)</Card.Title>
          <Card.Description>
            Suma aquí los valores de las facturas marcadas como "efectivo"
            y luego ingresa el total facturado del sistema.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="flex justify-end">
            <Button variant="ghost" onPress={() => setIsAyudaOpen(true)}>
              Abrir calculadora de ayuda
            </Button>
          </div>
        </Card.Content>
      </Card>

      {/* Arqueo oficial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Denominaciones */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <Card.Title> Desglose de efectivo físico</Card.Title>
            </Card.Header>
            <Card.Content>
              <DenominacionesGrid
                valores={detalles}
                onChange={(denominacion, cantidad) =>
                  setDetalles((prev) => ({ ...prev, [denominacion]: cantidad }))
                }
              />
            </Card.Content>
          </Card>
        </div>

        {/* Transferencias */}
        <div>
          <Card>
            <Card.Header>
              <Card.Title> Transferencias</Card.Title>
            </Card.Header>
            <Card.Content>
              <TransferenciasList
                transferencias={transferencias}
                onChange={setTransferencias}
              />
            </Card.Content>
          </Card>
        </div>

        {/* Datos del arqueo */}
        <div className="lg:col-span-3">
          <Card>
            <Card.Header>
              <Card.Title> Información del arqueo oficial</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="responsable">Responsable (quien recibe)</Label>
                  <Input
                    id="responsable"
                    value={responsableNombre}
                    onChange={(e) => setResponsableNombre(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="observaciones">Observaciones</Label>
                <TextField className="w-full">
                  <TextArea
                    id="observaciones"
                    placeholder="Notas adicionales..."
                    rows={3}
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                  />
                </TextField>
              </div>

              <div className="flex justify-end">
                <Button variant="primary" onPress={handleSubmit} isDisabled={isPending}>
                  Revisar y guardar
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Modales */}
      <AyudaSumatoriaModal
        isOpen={isAyudaOpen}
        onOpenChange={setIsAyudaOpen}
        totalFacturadoInicial={totalFacturado}
        onTotalFacturadoChange={setTotalFacturado}
      />
      <VistaPreviaArqueo
        isOpen={isVistaPreviaOpen}
        onOpenChange={setIsVistaPreviaOpen}
        responsableNombre={responsableNombre}
        totalFacturado={totalFacturado}
        totalEfectivoFisico={totalEfectivoFisico}
        totalTransferencias={totalTransferencias}
        granTotalReal={granTotalReal}
        diferencia={diferencia}
        detalles={detalles}
        transferencias={transferencias}
        observaciones={observaciones}
        onConfirm={confirmarGuardado}
        isSaving={isPending}
      />
    </div>
  );
};