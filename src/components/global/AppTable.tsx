import { Table, Spinner } from "@heroui/react";

interface Column {
  id: string;
  label: string;
  align?: "start" | "center" | "end";
}

interface Props {
  columns: Column[];
  items: any[];
  isLoading?: boolean;
  renderRow: (item: any) => React.ReactNode;
  ariaLabel: string;
}

export const AppTable = ({
  columns,
  items,
  isLoading,
  renderRow,
  ariaLabel,
}: Props) => {
  return (
    <Table variant="primary" className="w-full">
      <Table.ScrollContainer>
        <Table.Content aria-label={ariaLabel}>
          <Table.Header>
            {columns.map((col, index) => (
              <Table.Column
                key={col.id}
                id={col.id}
                isRowHeader={index === 0}
                className={col.align === "end" ? "text-end" : ""}
              >
                {col.label}
              </Table.Column>
            ))}
          </Table.Header>

          <Table.Body
            items={items}
            renderEmptyState={() =>
              isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <Spinner color="current" />
                </div>
              ) : (
                <div className="py-16 text-center text-default-400 text-sm">
                  No se encontraron resultados.
                </div>
              )
            }
          >
            {(isLoading ? [] : items).map((item) => renderRow(item))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
