// src/components/global/DataTable/DataTable.tsx
import { ReactNode } from 'react';
import { AppTable } from '../AppTable';
import { SearchInput } from '../SearchInput';
import { usePagination } from '@/hooks/usePagination';
import { DataTablePagination } from '../DataTablePagination';
import { RowsPerPageSelect } from '../RowsPaperSelect';

interface Props<T> {
  data: T[];
  columns: any[];
  renderRow: (item: T) => ReactNode;
  isLoading?: boolean;
  ariaLabel: string;
  title?: string; 
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  toolbarButtons?: ReactNode;
  rowsPerPageOptions?: number[];
}

export function DataTable<T>({
  data,
  columns,
  renderRow,
  isLoading,
  ariaLabel,
  title,
  searchTerm,
  onSearchChange,
  toolbarButtons,
  rowsPerPageOptions = [5, 10, 25, 50],
}: Props<T>) {
  const { paginatedData, page, rowsPerPage, totalPages, startItem, endItem, goToPage, setRowsPerPage } = usePagination({
    data,
    initialRowsPerPage: 5,
  });

  return (
    <div className="flex flex-col gap-3"> 
      {/* Toolbar con título a la izquierda y controles a la derecha */}
      {(title || searchTerm !== undefined || toolbarButtons) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Título (izquierda) */}
          {title && <h2 className="text-xl font-bold text-primary dark:text-white">{title}</h2>}
          
          {/* Controles (derecha) */}
          <div className="flex flex-wrap items-center gap-2">
            {searchTerm !== undefined && onSearchChange && (
              <SearchInput value={searchTerm} onChange={onSearchChange} />
            )}
            <RowsPerPageSelect value={rowsPerPage} onChange={setRowsPerPage} options={rowsPerPageOptions} />
            {toolbarButtons}
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <AppTable
          ariaLabel={ariaLabel}
          columns={columns}
          items={paginatedData}
          isLoading={isLoading}
          renderRow={renderRow}
        />
      </div>

      {/* Paginación */}
      <DataTablePagination
        page={page}
        totalPages={totalPages}
        startItem={startItem}
        endItem={endItem}
        totalItems={data.length}
        onPageChange={goToPage}
      />
    </div>
  );
}