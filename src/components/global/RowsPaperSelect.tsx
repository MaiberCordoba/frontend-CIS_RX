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
      className="border border-default-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary bg-white"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt} filas
        </option>
      ))}
    </select>
  );
};