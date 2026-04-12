// src/components/global/LogoutButton.tsx
import { Button } from "@heroui/react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Button
      variant="ghost"
      className="text-danger"
      onPress={handleLogout}
    >
      <LogOut size={16} />
      Salir
    </Button>
  );
};