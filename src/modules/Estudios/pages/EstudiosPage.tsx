// src/modules/Estudios/pages/EstudiosPage.tsx
import { Table, Button, Pagination } from "@heroui/react";
import { useEstudios } from "../hooks/useEstudios";
import { Plus, Pencil, Upload } from "lucide-react";
import { useState, useMemo } from "react";
import { AppTable } from "../../../components/global/AppTable";
import { EstudioFormModal } from "../components/EstudioFormModal";
import { Estudio } from "../EstudiosType";
import { UploadEstudiosModal } from "../components/UploadEstudiosModal";

export default function EstudiosPage() {
  const {
    data,
    isLoading,
    searchTerm,
    setSearchTerm,
    createEstudio,
    updateEstudio,
    isSaving,
  } = useEstudios();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEstudio, setSelectedEstudio] = useState<Estudio | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // 👈 Estado para filas por página

  // Filtrar datos por búsqueda
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(
      (estudio) =>
        estudio.codigo.toLowerCase().includes(term) ||
        estudio.nombre.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  // Paginar según rowsPerPage
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startItem = (page - 1) * rowsPerPage + 1;
  const endItem = Math.min(page * rowsPerPage, filteredData.length);

  // Resetear página al cambiar búsqueda o filas por página
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const handleOpenCreate = () => {
    setSelectedEstudio(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (estudio: Estudio) => {
    setSelectedEstudio(estudio);
    setIsModalOpen(true);
  };

  const handleSave = (data: Partial<Estudio>) => {
    if (selectedEstudio?.id) {
      updateEstudio({ id: selectedEstudio.id, estudio: data });
    } else {
      createEstudio(data as Omit<Estudio, "id">);
    }
    setIsModalOpen(false);
  };

  const columns = [
    { id: "codigo", label: "CÓDIGO" },
    { id: "nombre", label: "ESTUDIO" },
    { id: "precio", label: "PARTICULAR", align: "end" as const },
    { id: "precio2", label: "MÉDICOS", align: "end" as const },
    { id: "precio3", label: "PREVIRED", align: "end" as const },
    { id: "precio4", label: "FRECUENTE", align: "end" as const },
    { id: "acciones", label: "ACCIONES", align: "end" as const },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-primary">Catálogo de Estudios</h1>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar estudio..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-default-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary transition-colors w-full sm:w-64"
          />

          {/* Selector de filas por página */}
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border border-default-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary bg-white"
          >
            <option value="5">5 filas</option>
            <option value="10">10 filas</option>
            <option value="25">25 filas</option>
            <option value="50">50 filas</option>
          </select>

          <Button
            className="bg-primary text-white shrink-0"
            onPress={() => setIsUploadModalOpen(true)}
          >
            <Upload size={18} />
            Carga masiva
          </Button>

          <Button
            className="bg-primary text-white shrink-0"
            onPress={handleOpenCreate}
          >
            <Plus size={18} />
            Nuevo Estudio
          </Button>
        </div>
      </div>

      {/* Tabla - con scroll horizontal si es necesario */}
      <div className="overflow-x-auto">
        <AppTable
          ariaLabel="Tabla de precios de estudios"
          columns={columns}
          items={paginatedData}
          isLoading={isLoading}
          renderRow={(estudio: Estudio) => (
            <Table.Row key={estudio.id}>
              <Table.Cell className="font-bold text-primary whitespace-nowrap">
                {estudio.codigo}
              </Table.Cell>
              <Table.Cell className="font-medium whitespace-nowrap">
                {estudio.nombre}
              </Table.Cell>
              <Table.Cell className="text-end font-semibold whitespace-nowrap">
                ${Number(estudio.precio_particular).toLocaleString("es-CO")}
              </Table.Cell>
              <Table.Cell className="text-end font-semibold whitespace-nowrap">
                ${Number(estudio.precio_medicos).toLocaleString("es-CO")}
              </Table.Cell>
              <Table.Cell className="text-end font-semibold whitespace-nowrap">
                ${Number(estudio.precio_previred).toLocaleString("es-CO")}
              </Table.Cell>
              <Table.Cell className="text-end font-semibold whitespace-nowrap">
                ${Number(estudio.precio_plan_paciente_frecuente).toLocaleString("es-CO")}
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    onPress={() => handleOpenEdit(estudio)}
                    aria-label="Editar estudio"
                  >
                    <Pencil size={16} className="text-primary" />
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        />
      </div>

      {/* Paginación - solo si hay más de una página */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <Pagination size="sm">
            <Pagination.Summary>
              {startItem} a {endItem} de {filteredData.length} resultados
            </Pagination.Summary>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={page === 1}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <Pagination.PreviousIcon />
                  Anterior
                </Pagination.Previous>
              </Pagination.Item>
      
              {(() => {
                const maxVisible = 5;
                const half = Math.floor(maxVisible / 2);
                let start = Math.max(1, page - half);
                let end = Math.min(totalPages, start + maxVisible - 1);
                if (end - start + 1 < maxVisible) {
                  start = Math.max(1, end - maxVisible + 1);
                }
              
                const pages = [];
                if (start > 1) {
                  pages.push(1);
                  if (start > 2) pages.push('...');
                }
                for (let i = start; i <= end; i++) pages.push(i);
                if (end < totalPages) {
                  if (end < totalPages - 1) pages.push('...');
                  pages.push(totalPages);
                }
              
                return pages.map((p, idx) => (
                  <Pagination.Item key={idx}>
                    {p === '...' ? (
                      <span className="px-2">...</span>
                    ) : (
                      <Pagination.Link isActive={p === page} onPress={() => setPage(p as number)}>
                        {p}
                      </Pagination.Link>
                    )}
                  </Pagination.Item>
                ));
              })()}
      
              <Pagination.Item>
                <Pagination.Next
                  isDisabled={page === totalPages}
                  onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Siguiente
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      )}

      {/* Modales */}
      <EstudioFormModal
        key={selectedEstudio?.id ?? 'new'}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedEstudio={selectedEstudio}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <UploadEstudiosModal
        isOpen={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
      />
    </div>
  );
}