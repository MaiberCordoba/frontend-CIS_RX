// src/modules/Estudios/components/EstudioFormModal.tsx
import { Button, Form, Spinner } from "@heroui/react";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect } from "react";
import { AppModal } from "../../../components/global/AppModal";
import { AppInput } from "../../../components/global/AppInput";
import { Estudio } from "../EstudiosType";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEstudio: Estudio | null;
  onSave: (data: Partial<Estudio>) => void;
  isSaving: boolean;
}

export const EstudioFormModal = ({
  isOpen,
  onOpenChange,
  selectedEstudio,
  onSave,
  isSaving,
}: Props) => {
  const methods = useForm<Partial<Estudio>>({
    defaultValues: {
      codigo: "",
      nombre: "",
      precio_particular: "",
      precio_medicos: "",
      precio_previred: "",
      precio_plan_paciente_frecuente: "",
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (selectedEstudio) {
        methods.reset({
          codigo: selectedEstudio.codigo,
          nombre: selectedEstudio.nombre,
          precio_particular: selectedEstudio.precio_particular,
          precio_medicos: selectedEstudio.precio_medicos,
          precio_previred: selectedEstudio.precio_previred,
          precio_plan_paciente_frecuente: selectedEstudio.precio_plan_paciente_frecuente,
        });
      } else {
        methods.reset({
          codigo: "",
          nombre: "",
          precio_particular: "",
          precio_medicos: "",
          precio_previred: "",
          precio_plan_paciente_frecuente: "",
        });
      }
    }
  }, [isOpen, selectedEstudio, methods]);

  return (
    <AppModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={selectedEstudio ? "Editar Estudio" : "Nuevo Estudio"}
    >
      {((close: () => void) => (
        <FormProvider {...methods}>
          <Form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              methods.handleSubmit((data) => {
                onSave(data);
                close(); // Cerrar el modal después de guardar
              })(e);
            }}
          >
            <div className="md:col-span-2">
              <AppInput name="codigo" label="Código" placeholder="RX-01" />
            </div>
            <div className="md:col-span-2">
              <AppInput name="nombre" label="Nombre del Estudio" />
            </div>

            <AppInput
              name="precio_particular"
              label="Particular"
              type="number"
            />
            <AppInput name="precio_medicos" label="Médicos" type="number" />
            <AppInput name="precio_previred" label="Previred" type="number" />
            <AppInput
              name="precio_plan_paciente_frecuente"
              label="Plan Frecuente"
              type="number"
            />

            <div className="md:col-span-2 flex justify-end gap-2 mt-4 pb-2">
              <Button
                variant="ghost"
                onPress={close}
                isDisabled={isSaving}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="bg-primary text-white"
                isDisabled={isSaving}
              >
                {isSaving ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </div>
          </Form>
        </FormProvider>
      )) as (close: () => void) => React.ReactNode}
    </AppModal>
  );
};