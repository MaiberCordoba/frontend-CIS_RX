// src/modules/Users/components/UserFormModal.tsx
import { Button, Form, Spinner, Input, Label, Select, ListBox } from "@heroui/react";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect } from "react";
import { AppModal } from "../../../components/global/AppModal";
import { Usuario } from "../types";

// Tipo para el formulario: incluye los campos de Usuario más password opcional
interface UserFormData extends Partial<Usuario> {
  password?: string;
}

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: Usuario | null;
  onSave: (data: Partial<Usuario> & { password?: string }) => void;
  isSaving: boolean;
}

export const UserFormModal = ({ isOpen, onOpenChange, selectedUser, onSave, isSaving }: Props) => {
  const methods = useForm<UserFormData>({
    defaultValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      rol: "Facturador",
      telefono: "",
      password: "",
    },
  });

  const selectedRol = methods.watch("rol") || "Facturador";

  useEffect(() => {
    if (isOpen) {
      if (selectedUser) {
        methods.reset({
          username: selectedUser.username,
          email: selectedUser.email,
          first_name: selectedUser.first_name,
          last_name: selectedUser.last_name,
          rol: selectedUser.rol,
          telefono: selectedUser.telefono || "",
          password: "", // no cargar password en edición
        });
      } else {
        methods.reset({
          username: "",
          email: "",
          first_name: "",
          last_name: "",
          rol: "Facturador",
          telefono: "",
          password: "",
        });
      }
    }
  }, [isOpen, selectedUser, methods]);

  const handleSave = (data: UserFormData) => {
    // Si es edición y no se proporcionó password, lo omitimos
    if (selectedUser && !data.password) {
      const { password, ...rest } = data;
      onSave(rest);
    } else {
      onSave(data);
    }
  };

  return (
    <AppModal isOpen={isOpen} onOpenChange={onOpenChange} title={selectedUser ? "Editar Usuario" : "Nuevo Usuario"}>
      {((close) => (
        <FormProvider {...methods}>
          <Form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              methods.handleSubmit((data) => {
                handleSave(data);
                close();
              })(e);
            }}
          >
            {/* Usuario */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="username">Usuario *</Label>
              <Input id="username" {...methods.register("username", { required: true })} />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...methods.register("email", { required: true })} />
            </div>

            {/* Nombres */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="first_name">Nombres</Label>
              <Input id="first_name" {...methods.register("first_name")} />
            </div>

            {/* Apellidos */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="last_name">Apellidos</Label>
              <Input id="last_name" {...methods.register("last_name")} />
            </div>

            {/* Teléfono */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" {...methods.register("telefono")} />
            </div>

            {/* Rol con Select de HeroUI v3 */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="rol">Rol</Label>
              <Select
                id="rol"
                selectedKey={selectedRol}
                onSelectionChange={(key) => {
                  if (key) methods.setValue("rol", key as "Facturador" | "Jefe");
                }}
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="Facturador" textValue="Facturador">
                      Facturador
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="Jefe" textValue="Jefe">
                      Jefe
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>
              
            {/* Contraseña (solo obligatorio en creación) */}
            {!selectedUser && (
              <div className="flex flex-col gap-1">
                <Label htmlFor="password">Contraseña *</Label>
                <Input id="password" type="password" {...methods.register("password", { required: !selectedUser })} />
              </div>
            )}

            {/* Botones */}
            <div className="md:col-span-2 flex justify-end gap-2 mt-4">
              <Button variant="danger" onPress={close} isDisabled={isSaving}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary text-white" isDisabled={isSaving}>
                {isSaving ? <Spinner size="sm" color="current" /> : "Guardar"}
              </Button>
            </div>
          </Form>
        </FormProvider>
      ))}
    </AppModal>
  );
};