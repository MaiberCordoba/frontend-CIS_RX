// src/components/global/SearchInput.tsx
import { Input } from "@heroui/react";
import { Search } from "lucide-react";

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
      startContent={<Search size={16} />}
      className="w-full sm:w-64"
    />
  );
};