import { Navigate, Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import LoginPage from "./modules/Users/pages/loginPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import EstudiosPage from "./modules/Estudios/pages/EstudiosPage";
import DefaultLayout from "./layouts/default";
import ArqueoPage from "./modules/Arqueos/pages/ArqueoPage";

function App() {
  return (
    <Routes>
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

        <Route element={<PricingPage />} path="/pricing" />
        <Route element={<BlogPage />} path="/blog" />
        <Route element={<AboutPage />} path="/about" />
      
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
