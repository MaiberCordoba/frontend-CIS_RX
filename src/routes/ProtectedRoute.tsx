// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Props {
  allowedRoles?: ('Facturador' | 'Jefe')[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/arqueo" replace />;
  }
  return <Outlet />;
};