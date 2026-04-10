import { 
  Button, 
  Card, 
  TextField, 
  Label, 
  Input, 
} from "@heroui/react"; 
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm(); // Añadimos errors
  const { mutate: login, isPending } = useAuth();

  const onSubmit = (data: any) => {
    login(data);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <Card className="w-[400px]" variant="default">
        <Card.Header className="flex flex-col gap-1 items-center justify-center pt-6 text-center">
          <Card.Title className="text-2xl font-bold text-primary">
            CIS RX
          </Card.Title>
          <Card.Description>
            Ingresa tus credenciales para continuar
          </Card.Description>
        </Card.Header>
        
        <Card.Content className="px-6 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            
            {/* USO CORRECTO SEGÚN DOC V3: TextField + Label + Input */}
            <TextField className="flex flex-col gap-1">
              <Label className="text-sm font-medium">Usuario</Label>
              <Input
                {...register("username", { required: "El usuario es obligatorio" })} // Validación aquí
                variant="primary"
                formNoValidate={!!errors.username} // HeroUI v3: pone el borde rojo
              />
              {errors.username && <span className="text-xs text-danger">{errors.username.message as string}</span>}
            </TextField>

            <TextField className="flex flex-col gap-1">
              <Label className="text-sm font-medium">Contraseña</Label>
              <Input
                {...register("password", { required: "La contraseña es obligatoria" })}
                type="password"
                variant="primary"
                formNoValidate={!!errors.password}
              />
              {errors.password && <span className="text-xs text-danger">{errors.password.message as string}</span>}
            </TextField>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full bg-primary text-white"
              formNoValidate={isPending} 
              // Si hay errores en el form o está cargando, podemos deshabilitarlo para evitar doble clic
              isDisabled={isPending}
            >
              Entrar
            </Button>
            
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}