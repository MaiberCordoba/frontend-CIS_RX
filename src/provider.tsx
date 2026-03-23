import { HeroUIProvider } from "@heroui/system";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 1. Este es el motor para que los Arqueos e Inventario carguen rápido
const queryClient = new QueryClient();

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    // 2. Envolvemos para que TanStack Query funcione
    <QueryClientProvider client={queryClient}>
      {/* 3. Envolvemos para que los botones y tablas de HeroUI funcionen al 100% */}
      <HeroUIProvider navigate={navigate}>
        {children}
      </HeroUIProvider>
    </QueryClientProvider>
  );
}