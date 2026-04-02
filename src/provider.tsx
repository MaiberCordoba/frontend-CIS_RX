import { HeroUIProvider } from "@heroui/system";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";

// 1. Este es el motor para que los Arqueos e Inventario carguen rápido
const queryClient = new QueryClient();

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    // 2. Envolvemos para que TanStack Query funcione
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <HeroUIProvider navigate={navigate}>
        {children}
      </HeroUIProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}