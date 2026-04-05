// src/modules/Arqueos/pages/ArqueoPage.tsx
import { ArqueoForm } from '../components/ArqueoForm';

export default function ArqueoPage() {
  return (
    <div className="container mx-auto py-0">
      <h1 className="text-2xl font-bold text-primary mb-6">Cierre de Caja - Arqueo</h1>
      <ArqueoForm />
    </div>
  );
}

