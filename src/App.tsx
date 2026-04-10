import { Navigate, Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import LoginPage from "./modules/Users/pages/loginPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import EstudiosPage from "./modules/Estudios/pages/EstudiosPage";
import DefaultLayout from "./layouts/default";
import ArqueoPage from "./modules/Arqueos/pages/ArqueoPage";
import { Toast } from "@heroui/react";
import UsersPage from "./modules/Users/pages/UsersPage";

function App() {
  return (
    <div>

      <Toast.Provider/>
      <Routes>

        <Route element={<ProtectedRoute allowedRoles={['Jefe']} />}>
          <Route path="/usuarios" element={<DefaultLayout><UsersPage /></DefaultLayout>} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>


          {/* Redirigir cualquier ruta desconocida al login por ahora */}
          <Route element={<IndexPage />} path="/" />
          <Route element={
            <DefaultLayout>
              <EstudiosPage />
            </DefaultLayout>
            } path="/estudios" />

          <Route element={
            <DefaultLayout>
              <ArqueoPage />
            </DefaultLayout>
            } path="/arqueo" />

        </Route>
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </div>
  );
}

export default App;
