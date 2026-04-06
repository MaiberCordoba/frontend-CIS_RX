// src/modules/Arqueos/components/ArqueoPDF.tsx
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// --- Registro de Fuentes Profesionales ---
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
});
Font.register({
  family: 'Roboto Bold',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
});

// --- Estilos Modernos y Corporativos ---
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: 'Roboto',
    backgroundColor: '#FFFFFF',
    color: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '1.5 solid #1e3a8a',
  },
  headerLeft: {
    flexDirection: 'column',
    flex: 1,
  },
  logo: {
    width: 140,
    height: 'auto',
    marginBottom: 4,
  },
  logoPlaceholder: {
    width: 140,
    height: 45,
    backgroundColor: '#f8fafc',
    border: '1 dashed #cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  docTitle: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
    fontFamily: 'Roboto Bold',
    letterSpacing: 0.5,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 25,
    border: '0.5 solid #e2e8f0',
  },
  metaItem: {
    flexDirection: 'column',
  },
  metaLabel: {
    fontSize: 7,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 2,
    fontFamily: 'Roboto Bold',
  },
  metaValue: {
    fontSize: 10,
    fontFamily: 'Roboto Bold',
    color: '#1e3a8a',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Roboto Bold',
    color: '#1e3a8a',
    marginBottom: 8,
    textTransform: 'uppercase',
    borderLeft: '3 solid #1e3a8a',
    paddingLeft: 6,
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
    fontFamily: 'Roboto Bold',
    padding: 8,
    borderRadius: 3,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
    padding: 7,
    alignItems: 'center',
  },
  rowEven: {
    backgroundColor: '#f8fafc',
  },
  colDenom: { width: '40%' },
  colCantidad: { width: '20%', textAlign: 'center' },
  colSubtotal: { width: '40%', textAlign: 'right', fontFamily: 'Roboto Bold' },

  // --- RESUMEN FINAL (AJUSTADO: MENOS GROSOR) ---
  summaryContainer: {
    marginTop: 15,
    paddingVertical: 10, // Grosor reducido de 15 a 10
    paddingHorizontal: 15,
    backgroundColor: '#f1f5f9', // Fondo más suave
    border: '1 solid #cbd5e1',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#1e3a8a', // Texto en azul oscuro
    fontSize: 10,
    fontFamily: 'Roboto Bold',
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: '#1e3a8a', // Texto en azul oscuro
    fontSize: 16, // Ligeramente más pequeño para no verse tosco
    fontFamily: 'Roboto Bold',
  },

  obsBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fffbeb',
    border: '1 solid #fef3c7',
    borderRadius: 4,
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 70,
  },
  signatureBox: {
    width: '42%',
    borderTop: '1 solid #475569',
    paddingTop: 6,
    textAlign: 'center',
  },
  signatureLabel: {
    fontSize: 9,
    fontFamily: 'Roboto Bold',
    color: '#1e293b',
  },
  signatureSub: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 7,
    color: '#94a3b8',
    borderTop: '0.5 solid #e2e8f0',
    paddingTop: 8,
  }
});

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);

const formatearHora = (horaStr: string): string => {
  if (!horaStr) return '';
  let horaBase = horaStr.split('.')[0];
  let [horas, minutos] = horaBase.split(':').map(Number);
  const ampm = horas >= 12 ? 'PM' : 'AM';
  let horas12 = horas % 12 || 12;
  return `${horas12}:${minutos.toString().padStart(2, '0')} ${ampm}`;
};

interface Props {
  companyLogoUrl?: string;
  cajeroNombre: string;  
  responsableNombre: string;
  fecha: string;
  hora: string;
  totalEfectivoFisico: number;
  totalTransferencias: number;
  granTotalReal: number;
  detalles: { denominacion: number; cantidad: number; subtotal: number }[];
  transferencias: { valor: number; numero_factura: string }[];
  observaciones: string;
}

export const ArqueoPDF = ({
  companyLogoUrl,
  responsableNombre,
  cajeroNombre,  
  fecha,
  hora,
  totalEfectivoFisico,
  totalTransferencias,
  granTotalReal,
  detalles,
  transferencias,
  observaciones,
}: Props) => {
  const fechaFormateada = fecha ? new Date(fecha).toLocaleDateString('es-CO', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  }) : '';

  return (
    <Document title={`Arqueo_${responsableNombre}_${fecha}`}>
      <Page size="A4" style={styles.page}>
        
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {companyLogoUrl ? (
              <Image src={companyLogoUrl} style={styles.logo} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={{ fontSize: 8, color: '#94a3b8' }}>LOGO EMPRESA</Text>
              </View>
            )}
            <Text style={styles.docTitle}>Reporte diario: Arqueo de Caja</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={{ fontSize: 7, color: '#94a3b8' }}>CIS RX</Text>
          </View>
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Fecha de Reporte</Text>
            <Text style={styles.metaValue}>{fechaFormateada}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Hora de Cierre</Text>
            <Text style={styles.metaValue}>{formatearHora(hora)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Responsable de Caja</Text>
            <Text style={styles.metaValue}>{cajeroNombre.toUpperCase()}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Responsable que Recibe</Text>
            <Text style={styles.metaValue}>{responsableNombre.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Desglose de Efectivo Físico</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.colDenom}>Denominación</Text>
              <Text style={styles.colCantidad}>Cantidad</Text>
              <Text style={styles.colSubtotal}>Subtotal</Text>
            </View>
            {detalles.map((item, idx) => (
              <View key={idx} style={[styles.tableRow, idx % 2 !== 0 ? styles.rowEven : {}]}>
                <Text style={styles.colDenom}>{formatCurrency(item.denominacion)}</Text>
                <Text style={styles.colCantidad}>{item.cantidad}</Text>
                <Text style={styles.colSubtotal}>{formatCurrency(item.subtotal)}</Text>
              </View>
            ))}
          </View>
        </View>

        {transferencias.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Relación de Transferencias</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={{ width: '65%' }}>Referencia / Factura</Text>
                <Text style={{ width: '35%', textAlign: 'right' }}>Valor</Text>
              </View>
              {transferencias.map((t, idx) => (
                <View key={idx} style={[styles.tableRow, idx % 2 !== 0 ? styles.rowEven : {}]}>
                  <Text style={{ width: '65%' }}>{t.numero_factura}</Text>
                  <Text style={{ width: '35%', textAlign: 'right', fontFamily: 'Roboto Bold' }}>
                    {formatCurrency(t.valor)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 20, marginBottom: 5 }}>
            <Text style={{ fontSize: 8, color: '#64748b' }}>Efectivo: {formatCurrency(totalEfectivoFisico)}</Text>
            <Text style={{ fontSize: 8, color: '#64748b' }}>Transferencias: {formatCurrency(totalTransferencias)}</Text>
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Total ARQUEO</Text>
          <Text style={styles.summaryValue}>{formatCurrency(granTotalReal)}</Text>
        </View>

        {observaciones && (
          <View style={styles.obsBox}>
            <Text style={{ fontFamily: 'Roboto Bold', fontSize: 8, color: '#92400e', marginBottom: 3 }}>
              NOTAS Y OBSERVACIONES:
            </Text>
            <Text style={{ color: '#451a03', lineHeight: 1.4, fontSize: 8 }}>{observaciones}</Text>
          </View>
        )}

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>ENTREGADO POR</Text>
            <Text style={styles.signatureSub}>Firma del Facturador Responsable</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>RECIBIDO POR</Text>
            <Text style={styles.signatureSub}>Firma del Administrativo</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Este arqueo de caja es un documento oficial de control interno para Rayos X del Huila S.A.S. 
          Generado el {new Date().toLocaleDateString()} a las {new Date().toLocaleTimeString()}.
        </Text>
      </Page>
    </Document>
  );
};