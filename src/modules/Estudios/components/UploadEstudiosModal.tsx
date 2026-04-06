// src/modules/Estudios/components/UploadEstudiosModal.tsx
import { Button, Input, Spinner, toast } from "@heroui/react";
import { useState } from "react";
import { AppModal } from "../../../components/global/AppModal";
import { useUploadEstudios } from "../hooks/useUploadEstudios";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadEstudiosModal = ({ isOpen, onOpenChange }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const { mutate: upload, isPending } = useUploadEstudios();

  const handleSubmit = (close: () => void) => {
    if (!file) {
      toast.warning("Seleccione un archivo Excel");
      return;
    }
    upload(file, {
      onSuccess: () => {
        setFile(null);
        close(); // Cierra el modal
      }
    });
  };

  return (
    <AppModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Carga masiva de estudios"
    >
      {((close) => (
        <div className="flex flex-col gap-4">
          <p>Seleccione un archivo Excel con las columnas:</p>
          <ul className="list-disc list-inside text-sm">
            <li>codigo</li>
            <li>nombre</li>
            <li>precio_particular</li>
            <li>precio_medicos</li>
            <li>precio_previred</li>
            <li>precio_plan_paciente_frecuente</li>
          </ul>
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            disabled={isPending}  
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="danger" onPress={close} isDisabled={isPending}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              className="bg-primary text-white"
              onPress={() => handleSubmit(close)}
              isDisabled={isPending}
            >
              {isPending ? <Spinner size="sm" color="current" /> : "Subir"}
            </Button>
          </div>
        </div>
      ))}
    </AppModal>
  );
};