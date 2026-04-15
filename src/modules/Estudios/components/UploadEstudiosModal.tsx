// src/modules/Estudios/components/UploadEstudiosModal.tsx
import { Button, Input, Spinner, toast } from "@heroui/react";
import { useState, useEffect } from "react";
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

  // Resetear estado al cerrar el modal
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleSubmit = async (close: () => void) => {
    if (!file) {
      toast.danger("Archivo no seleccionado", {
        description: "Seleccione un archivo Excel para continuar"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const rawData: (string | number | null)[][] = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1, 
        defval: "" 
      });

      if (!rawData || rawData.length < 2) {
        toast.danger("Archivo insuficiente", {
          description: "El archivo no contiene datos suficientes"
        });
        setIsProcessing(false);
        return;
      }

      // Validar cabeceras
      const headers = rawData[0].map(cell => 
        String(cell).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
      );

      const expectedKeywords = [
        { index: 0, keywords: ["codigo", "cod", "código", "id"] },
        { index: 1, keywords: ["nombre", "nom", "descripcion", "desc"] },
        { index: 2, keywords: ["precio_particular", "particular", "pparticular"] },
        { index: 3, keywords: ["precio_medicos", "medicos", "med"] },
        { index: 4, keywords: ["precio_previred", "previred", "prev"] },
        { index: 5, keywords: ["precio_plan_paciente_frecuente", "frecuente", "plan", "paciente"] }
      ];

      let isValid = true;
      const errors = [];

      for (const col of expectedKeywords) {
        const headerText = headers[col.index] || "";
        const matches = col.keywords.some(kw => headerText.includes(kw));
        if (!matches && headerText !== "") {
          isValid = false;
          errors.push(`Columna ${col.index + 1}: esperaba "${col.keywords.join(', ')}", encontró "${headerText}"`);
        }
      }

      if (!isValid) {
        toast.danger("Formato incorrecto", {
          description: `El archivo no tiene el formato esperado.\n${errors.join('\n')}\n\nLas columnas deben ser: código, nombre, precio_particular, precio_medicos, precio_previred, precio_plan_paciente_frecuente.`
        });
        setIsProcessing(false);
        return;
      }

      const dataRows = rawData.slice(1);
      const estudios: any[] = [];

      for (const row of dataRows) {
        if (!Array.isArray(row)) continue;
        const codigoRaw = row[0];
        const codigo = codigoRaw ? String(codigoRaw).trim() : "";
        if (!codigo) continue;

        const nombre = row[1] ? String(row[1]).trim() : "";
        
        const limpiarNumero = (valor: any): number => {
          if (valor === undefined || valor === null) return 0;
          if (typeof valor === 'number') return valor;
          const str = String(valor).replace(/[^0-9.-]/g, '');
          const num = parseFloat(str);
          return isNaN(num) ? 0 : num;
        };

        estudios.push({
          codigo,
          nombre,
          precio_particular: limpiarNumero(row[2]),
          precio_medicos: limpiarNumero(row[3]),
          precio_previred: limpiarNumero(row[4]),
          precio_plan_paciente_frecuente: limpiarNumero(row[5]),
        });
      }

      if (estudios.length === 0) {
        toast.danger("Sin datos válidos", {
          description: "No se encontraron filas con código válido"
        });
        setIsProcessing(false);
        return;
      }

      upload(estudios, {
        onSuccess: () => {
          setFile(null);
          setIsProcessing(false);
          close();
        },
        onError: () => {
          setIsProcessing(false);
        }
      });
    } catch (error) {
      console.error(error);
      toast.danger("Error al procesar", {
        description: "No se pudo leer el archivo Excel. Verifique que no esté corrupto."
      });
      setIsProcessing(false);
    }
  };

  return (
    <AppModal isOpen={isOpen} onOpenChange={onOpenChange} title="Carga masiva de estudios">
      {((close) => (
        <div className="flex flex-col gap-4">
          <p>Seleccione un archivo Excel con las columnas en este orden:</p>
          <ul className="list-disc list-inside text-sm">
            <li>1. código</li>
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
            <Button variant="danger" onPress={close} isDisabled={isPending || isProcessing}>
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