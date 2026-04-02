// src/components/global/AppInput.tsx
import { Input, Label } from "@heroui/react";
import { useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

export const AppInput = ({ name, label, type = "text", placeholder }: Props) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        {...register(name)}
        type={type}
        placeholder={placeholder}
      />
      {errors[name] && (
        <span className="text-xs text-danger">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};