// src/modules/Estudios/pages/EstudiosPage.tsx
// ✅ Estado de modal centralizado en la página.
// ✅ handleOpenModal definido correctamente.
// ✅ Imports limpios (sin InputGroup ni Search sin usar).

import { Table, Button } from "@heroui/react";
import { useEstudios } from "../hooks/useEstudios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppTable } from "../../../components/global/AppTable";
import { EstudioFormModal } from "../components/EstudioFormModal";
import { Estudio } from "../EstudiosType";

export default function EstudiosPage() {
  const {
    data,
    isLoading,
    searchTerm,
    setSearchTerm,
    createEstudio,
    updateEstudio,
    isSaving,
  } = useEstudios();

  // Estado del modal centralizado en la página.
  // Un solo modal sirve tanto para Crear como para Editar,
  // dependiendo de si selectedEstudio es null o no.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEstudio, setSelectedEstudio] = useState<Estudio | null>(null);

  // Abrir para CREAR: limpiamos el seleccionado y abrimos.
  const handleOpenCreate = () => {
    setSelectedEstudio(null);
    setIsModalOpen(true);
  };

  // Abrir para EDITAR: guardamos el estudio y abrimos.
  const handleOpenEdit = (estudio: Estudio) => {
    setSelectedEstudio(estudio);
    setIsModalOpen(true);
  };

  // Handler de guardado unificado: decide si crear o actualizar.
  const handleSave = (data: Partial<Estudio>) => {
    if (selectedEstudio?.id) {
      updateEstudio({ id: selectedEstudio.id, estudio: data });
    } else {
      createEstudio(data as Omit<Estudio, "id">);
    }
    // Cerramos el modal después de disparar la mutación.
    setIsModalOpen(false);
  };

  const columns = [
    { id: "codigo", label: "CÓDIGO" },
    { id: "nombre", label: "ESTUDIO" },
    { id: "precio", label: "VALOR PARTICULAR", align: "end" as const },
    { id: "precio2", label: "VALOR MÉDICOS", align: "end" as const },
    { id: "precio3", label: "VALOR PREVIRED", align: "end" as const },
    { id: "precio4", label: "PLAN FRECUENTE", align: "end" as const },
    { id: "acciones", label: "ACCIONES", align: "end" as const },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ─── Encabezado ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-primary">Catálogo de Estudios</h1>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar estudio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-default-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary transition-colors w-full sm:w-64"
          />

          <Button
            className="bg-primary text-white shrink-0"
            onPress={handleOpenCreate}
          >
            <Plus size={18} />
            Nuevo Estudio
          </Button>
        </div>
      </div>

      <AppTable
        ariaLabel="Tabla de precios de estudios"
        columns={columns}
        items={data ?? []}
        isLoading={isLoading}
        renderRow={(estudio: Estudio) => (
          <Table.Row id={String(estudio.id)} key={estudio.id}>
            <Table.Cell className="font-bold text-primary">
              {estudio.codigo}
            </Table.Cell>
            <Table.Cell className="font-medium">{estudio.nombre}</Table.Cell>
            <Table.Cell className="text-end font-semibold">
              ${Number(estudio.precio_particular).toLocaleString("es-CO")}
            </Table.Cell>
            <Table.Cell className="text-end font-semibold">
              ${Number(estudio.precio_medicos).toLocaleString("es-CO")}
            </Table.Cell>
            <Table.Cell className="text-end font-semibold">
              ${Number(estudio.precio_previred).toLocaleString("es-CO")}
            </Table.Cell>
            <Table.Cell className="text-end font-semibold">
              ${Number(estudio.precio_plan_paciente_frecuente).toLocaleString("es-CO")}
            </Table.Cell>

            <Table.Cell>
              <div className="flex items-center justify-end gap-2">
                <Button
                  isIconOnly
                  variant="ghost"
                  size="sm"
                  onPress={() => handleOpenEdit(estudio)}
                  aria-label="Editar estudio"
                >
                  <Pencil size={16} className="text-primary" />
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        )}
      />

      <EstudioFormModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedEstudio={selectedEstudio}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
