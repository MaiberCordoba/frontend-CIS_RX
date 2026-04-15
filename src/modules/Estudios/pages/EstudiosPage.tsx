// src/modules/Estudios/pages/EstudiosPage.tsx
import { Table, Button, toast } from "@heroui/react";
import { Pencil, Upload, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useEstudios } from "../hooks/useEstudios";
import { Estudio } from "../EstudiosType";
import { EstudioFormModal } from "../components/EstudioFormModal";
import { UploadEstudiosModal } from "../components/UploadEstudiosModal";
import { ActionButton } from "@/components/global/ActionButton";
import { DataTable } from "@/components/global/DataTable.tsx/DataTable";
import { useAuth } from "@/context/AuthContext";
import { ConfirmModal } from "@/components/global/ConfirmModal";

export default function EstudiosPage() {
  const { user } = useAuth();
  const {
    data,
    isLoading,
    searchTerm,
    setSearchTerm,
    createEstudio,
    updateEstudio,
    deleteEstudio,    // 👈 Nueva función
    isSaving,
    isDeleting,       // 👈 Estado de carga para eliminar
  } = useEstudios();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEstudio, setSelectedEstudio] = useState<Estudio | null>(null);
  const [estudioToDelete, setEstudioToDelete] = useState<Estudio | null>(null); // 👈 Para confirmar eliminación
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // 👈 Modal de confirmación

  const isJefe = user?.rol === "Jefe";

  const checkRoleOrWarn = (action: () => void) => {
    if (isJefe) {
      action();
    } else {
      toast.danger("Acceso denegado", {
        description: "Solo los usuarios con rol Jefe pueden realizar esta acción.",
      });
    }
  };

  const handleOpenCreate = () => {
    setSelectedEstudio(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (estudio: Estudio) => {
    if (!isJefe) {
      toast.danger("Acceso denegado", {
        description: "Solo los usuarios con rol Jefe pueden editar estudios.",
      });
      return;
    }
    setSelectedEstudio(estudio);
    setIsModalOpen(true);
  };

  // 👇 Función para abrir el modal de confirmación de eliminación
  const handleDeleteClick = (estudio: Estudio) => {
    if (!isJefe) {
      toast.danger("Acceso denegado", {
        description: "Solo los usuarios con rol Jefe pueden eliminar estudios.",
      });
      return;
    }
    setEstudioToDelete(estudio);
    setIsConfirmOpen(true);
  };

  // 👇 Confirmar eliminación
  const handleConfirmDelete = () => {
    if (estudioToDelete) {
      deleteEstudio(estudioToDelete.id);
      setEstudioToDelete(null);
    }
    setIsConfirmOpen(false);
  };

  const handleSave = (data: Partial<Estudio>) => {
    if (selectedEstudio?.id) {
      updateEstudio({ id: selectedEstudio.id, estudio: data });
    } else {
      createEstudio(data as Omit<Estudio, "id">);
    }
    setIsModalOpen(false);
  };

  const columns = [
    { id: "codigo", label: "CÓDIGO" },
    { id: "nombre", label: "ESTUDIO" },
    { id: "precio", label: "PARTICULAR", align: "end" as const },
    { id: "precio2", label: "MÉDICOS", align: "end" as const },
    { id: "precio3", label: "PREVIRED", align: "end" as const },
    { id: "precio4", label: "FRECUENTE", align: "end" as const },
    { id: "acciones", label: "ACCIONES", align: "end" as const },
  ];

  // Botones responsivos: solo visibles para Jefe
  const toolbarButtons = isJefe ? (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <ActionButton
        onPress={() => checkRoleOrWarn(() => setIsUploadModalOpen(true))}
        icon={<Upload size={18} />}
        className="w-full sm:w-auto"
      >
        Carga masiva
      </ActionButton>
      <ActionButton
        onPress={() => checkRoleOrWarn(handleOpenCreate)}
        icon={<Plus size={18} />}
        className="w-full sm:w-auto"
      >
        Nuevo Estudio
      </ActionButton>
    </div>
  ) : null;

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        data={data ?? []}
        columns={columns}
        isLoading={isLoading}
        ariaLabel="Tabla de precios de estudios"
        title="Catálogo de Estudios"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        toolbarButtons={toolbarButtons}
        renderRow={(estudio: Estudio) => (
          <Table.Row key={estudio.id}>
            <Table.Cell className="font-bold text-primary dark:text-gray-400 whitespace-nowrap">
              {estudio.codigo}
            </Table.Cell>
            <Table.Cell className="font-medium whitespace-nowrap">{estudio.nombre}</Table.Cell>
            <Table.Cell className="text-end font-semibold whitespace-nowrap">
              ${Number(estudio.precio_particular).toLocaleString("es-CO")}
            </Table.Cell>
            <Table.Cell className="text-end font-semibold whitespace-nowrap">
              ${Number(estudio.precio_medicos).toLocaleString("es-CO")}
            </Table.Cell>
            <Table.Cell className="text-end font-semibold whitespace-nowrap">
              ${Number(estudio.precio_previred).toLocaleString("es-CO")}
            </Table.Cell>
            <Table.Cell className="text-end font-semibold whitespace-nowrap">
              ${Number(estudio.precio_plan_paciente_frecuente).toLocaleString("es-CO")}
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center justify-end gap-2">
                <Button
                  isIconOnly
                  size="sm"
                  className="bg-transparent text-primary hover:bg-primary/10 dark:bg-primary dark:text-white dark:hover:bg-primary/80"
                  onPress={() => handleOpenEdit(estudio)}
                  aria-label="Editar estudio"
                >
                  <Pencil size={16} />
                </Button>
                {/* Botón eliminar: solo para Jefe */}
                {isJefe && (
                  <Button
                    isIconOnly
                    size="sm"
                    className="bg-transparent text-danger hover:bg-danger/10"
                    onPress={() => handleDeleteClick(estudio)}
                    aria-label="Eliminar estudio"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </Table.Cell>
          </Table.Row>
        )}
      />

      <EstudioFormModal
        key={selectedEstudio?.id ?? 'new'}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedEstudio={selectedEstudio}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <UploadEstudiosModal isOpen={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} />

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Confirmar eliminación"
        message={`¿Estás seguro de eliminar el estudio "${estudioToDelete?.codigo} - ${estudioToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
      />
    </div>
  );
}