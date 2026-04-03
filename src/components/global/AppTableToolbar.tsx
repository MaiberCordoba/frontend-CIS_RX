// src/components/global/AppTableToolbar.tsx
import { Button } from "@heroui/react";
import { ReactNode } from "react";

interface Props {
  title?: string;
  searchValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
  rowsPerPage: number;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  rowsPerPageOptions?: number[];
  extraButtons?: ReactNode; // Para botones como "Nuevo", "Carga masiva", etc.
}

export const AppTableToolbar = ({
  title,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  rowsPerPage,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50],
  extraButtons,
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {title && <h1 className="text-2xl font-bold text-primary">{title}</h1>}

      <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
        {/* Buscador */}
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
          className="border border-default-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary transition-colors w-full sm:w-64"
        />

        {/* Selector de filas por página */}
        <select
          value={rowsPerPage}
          onChange={onRowsPerPageChange}
          className="border border-default-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary bg-white"
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option} filas
            </option>
          ))}
        </select>

        {/* Botones adicionales */}
        {extraButtons}
      </div>
    </div>
  );
};