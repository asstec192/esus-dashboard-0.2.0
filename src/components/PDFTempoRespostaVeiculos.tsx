import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";
import { useTurnStore } from "@/hooks/useTurnStore";
import { RouterOutputs } from "@/utils/api";
import {
  Page,
  PDFViewer,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { ReactNode } from "react";

// Register font
Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    margin: 10,
    padding: 10,
    textAlign: "center",
  },
  col: {
    flexDirection: "column",
    gap: 4,
    marginTop: 4,
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    rowGap: 4,
    columnGap: 8,
    flexWrap: "wrap",
    borderRadius: 4,
  },
  title: {
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
  p: {
    fontWeight: "medium",
    fontSize: 12,
  },
  small: {
    fontFamily: "Open Sans",
    fontWeight: "bold",
    fontSize: 12,
  },
  table: {
    flexDirection: "column",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "16.66%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    //margin: "auto",
    padding: 4,
    fontSize: 10,
  },
});

const Field = ({
  label,
  children,
}: {
  label: string;
  children?: ReactNode;
}) => {
  return (
    <View style={{ ...styles.row, alignItems: "flex-end" }}>
      <Text style={styles.small}>{label}</Text>
      <Text style={styles.p}>{children}</Text>
    </View>
  );
};

const PDFTableCol = ({ children }: { children: ReactNode }) => {
  return (
    <View style={styles.tableCol}>
      <Text style={styles.tableCell}>{children}</Text>
    </View>
  );
};

export const PDFTempoRespostaVeiculos = ({
  data,
}: {
  data: RouterOutputs["vehicles"]["getResponseTimes"];
}) => {
  const dateRange = useGlogalDateFilterStore((state) => state.dateRange);
  const turn = useTurnStore((state) => state.turn);
  return (
    <PDFViewer className="h-[90vh] w-full">
      <Document>
        <Page size="A4" style={styles.page}>
          <View>
            <Text style={styles.title}>
              Relatório de Atendimento de Veículos
            </Text>
          </View>
          <View>
            <Text style={styles.title}>
              {`De ${format(dateRange.from!, "dd/MM/yyyy")} à ${format(
                dateRange.to!,
                "dd/MM/yyyy",
              )}`}
            </Text>
            <Text style={styles.title}>{`Turno: ${turn.label}`}</Text>
            <Text style={styles.title}>
              Data de emissâo: {new Date().toLocaleString()}
            </Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <PDFTableCol>Veículo</PDFTableCol>
              <PDFTableCol>Chegada ao local - QTY QUS (min)</PDFTableCol>
              <PDFTableCol>Atendimento no local - QUS QUY (min) </PDFTableCol>
              <PDFTableCol>Chegada ao destino - QUY QUU (min)</PDFTableCol>
              <PDFTableCol>N° de Ocorrências</PDFTableCol>
              <PDFTableCol>N° de Pacientes</PDFTableCol>
            </View>
            {data.map((veiculo) => (
              <View style={styles.tableRow}>
                <PDFTableCol>{veiculo.nome}</PDFTableCol>
                <PDFTableCol>{veiculo.QTYQUS}</PDFTableCol>
                <PDFTableCol>{veiculo.QUSQUY}</PDFTableCol>
                <PDFTableCol>{veiculo.QUYQUU}</PDFTableCol>
                <PDFTableCol>{veiculo.totalOcorrencias}</PDFTableCol>
                <PDFTableCol>{veiculo.totalPacientes}</PDFTableCol>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
