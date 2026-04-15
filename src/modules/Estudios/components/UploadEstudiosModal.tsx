// src/modules/Estudios/components/UploadEstudiosModal.tsx
import { Button, Input, Spinner } from "@heroui/react";
import { useState } from "react";
import { AppModal } from "../../../components/global/AppModal";
import { useUploadEstudios } from "../hooks/useUploadEstudios";
import * as XLSX from 'xlsx';

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadEstudiosModal = ({ isOpen, onOpenChange }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { mutate: upload, isPending } = useUploadEstudios();

  const handleSubmit = async (close: () => void) => {
    if (!file) {
      alert("Seleccione un archivo Excel");
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Leer el archivo
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // 2. Convertir a matriz (array de arrays) sin interpretar cabeceras
      const rawData: (string | number | null)[][] = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1, 
        defval: "" 
      });

      if (!rawData || rawData.length < 2) {
        alert("El archivo no contiene datos suficientes");
        setIsProcessing(false);
        return;
      }

      // 3. Asumir que la primera fila son las cabeceras (las ignoramos)
      const dataRows = rawData.slice(1);
      
      // 4. Limpiar y mapear cada fila
      const estudios: any[] = [];
      for (const row of dataRows) {
        // Asegurar que row es un array y tiene al menos 1 elemento
        if (!Array.isArray(row)) continue;
        
        const codigoRaw = row[0];
        const codigo = codigoRaw ? String(codigoRaw).trim() : "";
        if (!codigo) continue; // Saltar filas sin código

        const nombre = row[1] ? String(row[1]).trim() : "";
        
        // Función para limpiar valores monetarios (quitar $, espacios, convertir a número)
        const limpiarNumero = (valor: any): number => {
          if (valor === undefined || valor === null) return 0;
          if (typeof valor === 'number') return valor;
          const str = String(valor).replace(/[^0-9.-]/g, ''); // elimina todo excepto números, punto y signo menos
          const num = parseFloat(str);
          return isNaN(num) ? 0 : num;
        };

        const precio_particular = limpiarNumero(row[2]);
        const precio_medicos = limpiarNumero(row[3]);
        const precio_previred = limpiarNumero(row[4]);
        const precio_frecuente = limpiarNumero(row[5]);

        estudios.push({
          codigo,
          nombre,
          precio_particular,
          precio_medicos,
          precio_previred,
          precio_plan_paciente_frecuente: precio_frecuente,
        });
      }

      console.log("Estudios procesados:", estudios.length);
      
      if (estudios.length === 0) {
        alert("No se encontraron datos válidos. Verifique que la primera columna (código) tenga valores.");
        setIsProcessing(false);
        return;
      }

      // 5. Enviar al backend
      upload(estudios, {
        onSuccess: () => {
          setFile(null);
          close();
        }
      });
    } catch (error) {
      console.error("Error al procesar Excel:", error);
      alert("Error al leer el archivo Excel. Asegúrate de que no esté corrupto.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AppModal isOpen={isOpen} onOpenChange={onOpenChange} title="Carga masiva de estudios">
      {((close) => (
        <div className="flex flex-col gap-4">
          <p>Seleccione un archivo Excel con las columnas en este orden:</p>
          <ul className="list-disc list-inside text-sm">
            <li>1. codigo</li>
            <li>2. nombre</li>
            <li>3. precio_particular</li>
            <li>4. precio_medicos</li>
            <li>5. precio_previred</li>
            <li>6. precio_plan_paciente_frecuente</li>
          </ul>
          <p className="text-xs text-default-500">Los precios pueden tener $, puntos y espacios.</p>
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            disabled={isPending || isProcessing}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onPress={close} isDisabled={isPending || isProcessing}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              className="bg-primary text-white"
              onPress={() => handleSubmit(close)}
              isDisabled={isPending || isProcessing || !file}
            >
              {(isPending || isProcessing) ? <Spinner size="sm" color="current" /> : "Subir"}
            </Button>
          </div>
        </div>
      ))}
    </AppModal>
  );
};