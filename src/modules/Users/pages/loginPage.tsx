// src/modules/Users/pages/LoginPage.tsx
import { Button, Card, Label, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { mutate: login, isPending } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = (data: any, e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    setErrorMsg("");
    login(data, {
      onError: (error: any) => {
        const mensaje = error.response?.data?.detail || "Credenciales incorrectas";
        setErrorMsg(mensaje);
      }
    });
  };

  return (
    // Fondo con un degradado suave y un patrón médico sutil si fuera posible, o simplemente un gris muy claro
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      
      <Card className="w-[450px] shadow-2xl border-none" variant="default">
        <Card.Header className="flex flex-col gap-2 items-center justify-center pt-10 pb-4 text-center">
          
          {/* Logo o Título Institucional */}
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#1565AE]">
              CIS <span className="text-slate-700">RX</span>
            </h1>
          </div>
          
          <Card.Description className="text-slate-400">
            Cierres de Caja  • Precios Estudios
          </Card.Description>
        </Card.Header>
        
        <Card.Content className="px-10 pb-12">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-slate-700 ml-1">Usuario</Label>
              <Input
                {...register("username", { required: "El usuario es obligatorio" })}
                placeholder="Ingresa tu nombre de usuario"
                className="h-12 border-slate-200 focus:border-[#1565AE] transition-all"
                formNoValidate={!!errors.username}
              />
              {errors.username && (
                <span className="text-[11px] font-medium text-red-500 ml-1 mt-1 uppercase tracking-wider">
                   ⚠ {errors.username.message as string}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-slate-700 ml-1">Contraseña</Label>
              <Input
                {...register("password", { required: "La contraseña es obligatoria" })}
                type="password"
                placeholder="••••••••"
                className="h-12 border-slate-200 focus:border-[#1565AE] transition-all"
                formNoValidate={!!errors.password}
              />
              {errors.password && (
                <span className="text-[11px] font-medium text-red-500 ml-1 mt-1 uppercase tracking-wider">
                   ⚠ {errors.password.message as string}
                </span>
              )}
            </div>

            {/* Alerta de Error más estética */}
            {errorMsg && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl animate-appearance-in">
                <span className="text-lg">✕</span>
                <p className="font-medium">Credenciales incorrectas. Verifica tus datos.</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 mt-4 bg-[#1565AE] hover:bg-[#114d85] text-white font-bold text-md rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-95"
              isDisabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                   <span className="animate-spin text-lg">◌</span> Ingresando...
                </div>
              ) : (
                "INICIAR SESIÓN"
              )}
            </Button>
            
            <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-[2px]">
              Rayos X del Huila S.A.S
            </p>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}