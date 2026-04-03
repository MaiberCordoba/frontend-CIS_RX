// src/components/global/SearchInput.tsx
import { Input } from "@heroui/react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput = ({ value, onChange, placeholder = "Buscar..." }: Props) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full sm:w-64"
    />
  );
};