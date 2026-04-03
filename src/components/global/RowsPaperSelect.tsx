// src/components/global/RowsPerPageSelect.tsx
interface Props {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
}

export const RowsPerPageSelect = ({ value, onChange, options = [5, 10, 25, 50] }: Props) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="
        cursor-pointer rounded-xl px-3 py-2 text-sm
        bg-[var(--field-background,var(--200))]
        text-[var(--field-foreground,var(--foreground))]
        shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]   
        border border-[var(--default)]          
        focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
        transition-all duration-200
      "
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt} filas
        </option>
      ))}
    </select>
  );
};