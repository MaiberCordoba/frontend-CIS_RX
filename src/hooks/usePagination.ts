// src/components/global/usePagination.ts
import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  initialRowsPerPage?: number;
}

export const usePagination = <T,>({ data, initialRowsPerPage = 10 }: UsePaginationProps<T>) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startItem = (page - 1) * rowsPerPage + 1;
  const endItem = Math.min(page * rowsPerPage, data.length);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage]);

  const goToPage = (newPage: number) => setPage(Math.min(Math.max(1, newPage), totalPages));
  const changeRowsPerPage = (newRows: number) => {
    setRowsPerPage(newRows);
    setPage(1);
  };

  return {
    page,
    rowsPerPage,
    totalPages,
    startItem,
    endItem,
    paginatedData,
    goToPage,
    setRowsPerPage: changeRowsPerPage,
  };
};