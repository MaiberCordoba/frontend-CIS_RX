// src/components/global/ConfirmModal.tsx
import { Button } from "@heroui/react";
import { AppModal } from "./AppModal";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  onConfirm: () => void;
  isConfirming?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onOpenChange,
  title,
  message,
  onConfirm,
  isConfirming = false,
}: Props) => {
  return (
    <AppModal isOpen={isOpen} onOpenChange={onOpenChange} title={title}>
      {((close) => (
        <div className="flex flex-col gap-4">
          <p className="text-default-600">{message}</p>
          <div className="flex justify-end gap-2">
            <Button  className="bg-gray-800" variant="primary" onPress={close} isDisabled={isConfirming}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onPress={() => {
                onConfirm();
                close();
              }}
              isPending={isConfirming}
              isDisabled={isConfirming}
            >
              Eliminar
            </Button>
          </div>
        </div>
      ))}
    </AppModal>
  );
};