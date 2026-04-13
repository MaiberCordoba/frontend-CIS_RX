import { useState } from "react";
import { Table, Button } from "@heroui/react";
import { UserFormModal } from "../components/UserFormModal";
import { Usuario } from "../types";
import { ActionButton } from "@/components/global/ActionButton";
import { Pencil, Trash2, Plus } from "lucide-react";
import { DataTable } from "@/components/global/DataTable.tsx/DataTable";
import { useUsuarios } from "../hooks/UseUsuarios";
import { ConfirmModal } from "@/components/global/ConfirmModal";

export default function UsersPage() {
  const { data: users, isLoading, createUsuario, updateUsuario, deleteUsuario, isCreating, isUpdating, isDeleting } = useUsuarios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: Usuario) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user: Usuario) => {
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUsuario(userToDelete.id);
      setUserToDelete(null);
    }
    setIsConfirmOpen(false);
  };

  const handleSave = (data: Partial<Usuario>) => {
    if (selectedUser?.id) {
      updateUsuario({ id: selectedUser.id, data });
    } else {
      createUsuario(data as Omit<Usuario, "id">);
    }
    setIsModalOpen(false);
  };

  const columns = [
    { id: "username", label: "Usuario" },
    { id: "nombre", label: "Nombre completo" },
    { id: "email", label: "Email" },
    { id: "rol", label: "Rol" },
    { id: "acciones", label: "Acciones", align: "end" as const },
  ];

  const toolbarButtons = (
    <ActionButton onPress={handleOpenCreate} icon={<Plus size={18} />}>
      Nuevo Usuario
    </ActionButton>
  );

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        data={users ?? []}
        columns={columns}
        isLoading={isLoading}
        ariaLabel="Tabla de usuarios"
        title="Gestión de Usuarios"
        toolbarButtons={toolbarButtons}
        renderRow={(user: Usuario) => (
          <Table.Row key={user.id}>
            <Table.Cell className="font-medium">{user.username}</Table.Cell>
            <Table.Cell>{`${user.first_name} ${user.last_name}`}</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell>{user.rol}</Table.Cell>
            <Table.Cell>
              <div className="flex justify-end gap-2">
                <Button isIconOnly variant="ghost" size="sm" onPress={() => handleOpenEdit(user)}>
                  <Pencil size={16} className="text-primary" />
                </Button>
                <Button isIconOnly variant="ghost" size="sm" onPress={() => handleDeleteClick(user)} isPending={isDeleting}>
                  <Trash2 size={16} className="text-danger" />
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        )}
      />
      <UserFormModal
        key={selectedUser?.id ?? 'new'}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedUser={selectedUser}
        onSave={handleSave}
        isSaving={isCreating || isUpdating}
      />
      <ConfirmModal
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Confirmar eliminación"
        message={`¿Estás seguro de eliminar al usuario "${userToDelete?.username}"? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
      />
    </div>
  );
}