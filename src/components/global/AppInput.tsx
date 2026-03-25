import { TextField, Label, Input } from "@heroui/react";
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
    <TextField className="flex flex-col gap-1 w-full" isInvalid={!!errors[name]}>
      <Label className="text-sm font-semibold text-default-700">{label}</Label>
      <Input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        variant="primary" // Esta variante sí existe en tu doc
        className="w-full"
      />
      {errors[name] && (
        <span className="text-xs text-danger">
          {errors[name]?.message as string}
        </span>
      )}
    </TextField>
  );
};