// src/modules/Users/components/PerfilModal.tsx
import { Button, Form, Spinner, Input, Label, toast } from "@heroui/react";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect } from "react";
import { AppModal } from "../../../components/global/AppModal";
import { useUsuarios } from "../hooks/UseUsuarios";
import { useAuth } from "@/context/AuthContext";

interface PerfilFormData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  telefono: string;
  password?: string;
  confirm_password?: string;
}

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PerfilModal = ({ isOpen, onOpenChange }: Props) => {
  const { user, updateUser } = useAuth();
  const { updateUsuario, isUpdating } = useUsuarios();
  const methods = useForm<PerfilFormData>({
    defaultValues: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      telefono: "",
      password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    if (isOpen && user) {
      methods.reset({
        username: user.username || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        telefono: user.telefono || "",
        password: "",
        confirm_password: "",
      });
    }
  }, [isOpen, user, methods]);

  const onSubmit = async (data: PerfilFormData) => {
    if (!user) return;

    // Validar contraseñas
    if (data.password && data.password !== data.confirm_password) {
      toast.warning("Validación", { description: "Las contraseñas no coinciden" });
      return;
    }

    // Si se va a cambiar la contraseña, mostrar confirmación
    if (data.password) {
      const confirm = window.confirm("¿Estás seguro de que deseas cambiar tu contraseña?");
      if (!confirm) return;
    }

    // Construir objeto a enviar
    const updateData: any = {
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      telefono: data.telefono,
    };
    if (data.password) {
      updateData.password = data.password;
    }

    updateUsuario(
      { id: user.id, data: updateData },
      {
        onSuccess: (updatedUser) => {
          updateUser(updatedUser);
          toast.success("Éxito", { description: "Tu información ha sido actualizada correctamente" });
          onOpenChange(false);
          methods.reset({ ...updatedUser, password: "", confirm_password: "" });
        },
        onError: (error: any) => {
          const mensaje = error.response?.data?.detail || error.response?.data?.message || "Ocurrió un error al guardar los cambios";
          toast.danger("Error", { description: mensaje });
        },
      }
    );
  };

  return (
    <AppModal isOpen={isOpen} onOpenChange={onOpenChange} title="Mi Perfil">
      {((close) => (
        <FormProvider {...methods}>
          <Form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              methods.handleSubmit(onSubmit)(e);
            }}
          >
            <div className="flex flex-col gap-1">
              <Label htmlFor="username">Usuario</Label>
              <Input id="username" {...methods.register("username")} />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="first_name">Nombres</Label>
              <Input id="first_name" {...methods.register("first_name")} />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="last_name">Apellidos</Label>
              <Input id="last_name" {...methods.register("last_name")} />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...methods.register("email")} />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" {...methods.register("telefono")} />
            </div>

            <div className="border-t pt-2 mt-2">
              <Label className="font-semibold">Cambiar contraseña (opcional)</Label>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input id="password" type="password" {...methods.register("password")} />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="confirm_password">Confirmar nueva contraseña</Label>
              <Input id="confirm_password" type="password" {...methods.register("confirm_password")} />
              {methods.formState.errors.confirm_password && (
                <span className="text-xs text-danger">{methods.formState.errors.confirm_password.message}</span>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onPress={close} isDisabled={isUpdating}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary text-white" isDisabled={isUpdating}>
                {isUpdating ? <Spinner size="sm" color="current" /> : "Guardar cambios"}
              </Button>
            </div>
          </Form>
        </FormProvider>
      ))}
    </AppModal>
  );
};