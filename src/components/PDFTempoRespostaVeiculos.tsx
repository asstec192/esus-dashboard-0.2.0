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
  subtitle: {
    fontWeight: 600,
    fontSize: 14,
    backgroundColor: "#c40e2f",
    color: "white",
    padding: 3,
    borderRadius: 2,
    marginBottom: 4,
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
  return (
    <PDFViewer className="h-[90vh] w-full">
      <Document>
        <Page size="A4" style={styles.page}>
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
