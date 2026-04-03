// src/components/global/AppModal.tsx
import { Modal, useOverlayState } from "@heroui/react";
import { useEffect } from "react";

type ModalChildren = React.ReactNode | ((close: () => void) => React.ReactNode);

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ModalChildren;
}

export const AppModal = ({ isOpen, onOpenChange, title, children }: Props) => {
  const state = useOverlayState({ isOpen, onOpenChange });

  useEffect(() => {
    if (isOpen && !state.isOpen) state.open();
    if (!isOpen && state.isOpen) state.close();
  }, [isOpen, state]);

  return (
    <Modal state={state}>
      <Modal.Backdrop variant="transparent">
        <Modal.Container>
          <Modal.Dialog className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-default-200 w-full max-w-[500px] outline-none">
            {({ close }) => (
              <>
                <Modal.CloseTrigger />

                <Modal.Header className="px-6 pt-6">
                  <Modal.Heading  className="text-xl font-bold text-primary dark:text-white">
                    {title}
                  </Modal.Heading>
                </Modal.Header>

                <Modal.Body className="px-6 py-4 text-foreground">
                  {typeof children === "function" ? children(close) : children}
                </Modal.Body>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};