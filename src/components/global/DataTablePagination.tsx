// src/components/global/DataTablePagination.tsx
import { Pagination } from "@heroui/react";

interface Props {
  page: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const DataTablePagination = ({ page, totalPages, startItem, endItem, totalItems, onPageChange }: Props) => {
  if (totalPages <= 1) return null;

  const maxVisible = 5;
  const getPageNumbers = () => {
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    const pages: (number | string)[] = [];
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex justify-end mt-4">
      <Pagination size="sm">
        <Pagination.Summary>
          {startItem} a {endItem} de {totalItems} resultados
        </Pagination.Summary>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={page === 1}
              onPress={() => onPageChange(page - 1)}
            >
              <Pagination.PreviousIcon />
              Anterior
            </Pagination.Previous>
          </Pagination.Item>

          {getPageNumbers().map((p, idx) => (
            <Pagination.Item key={idx}>
              {p === '...' ? (
                <span className="px-2">...</span>
              ) : (
                <Pagination.Link isActive={p === page} onPress={() => onPageChange(p as number)}>
                  {p}
                </Pagination.Link>
              )}
            </Pagination.Item>
          ))}

          <Pagination.Item>
            <Pagination.Next
              isDisabled={page === totalPages}
              onPress={() => onPageChange(page + 1)}
            >
              Siguiente
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
};