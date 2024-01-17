"use client";

import { differenceInDays, format } from "date-fns";
import { ReactNode } from "react";
import { formatProperName } from "@/utils/formatProperName";
import logo from "public/images/logo-samu.png";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { useRegulacaoSecundariaStore } from "../stores";
import { api } from "@/trpc/react";
import { PDFModal } from "@/components/PDF/modal";

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
    backgroundColor: "white",
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  header: {
    margin: 10,
    padding: 10,
    textAlign: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  body: {
    flexDirection: "column",
  },
  col: {
    flexDirection: "column",
    gap: 2,
    marginTop: 4,
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    rowGap: 2,
    columnGap: 6,
    flexWrap: "wrap",
    borderRadius: 4,
  },
  title: {
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
    fontFamily: "Open Sans",
  },
  text: {
    padding: 4,
    fontSize: 10,
    fontFamily: "Open Sans",
  },
  decoratedText: {
    padding: 4,
    fontSize: 10,
    backgroundColor: "#c40e2f",
    color: "white",
    fontWeight: "bold",
    fontFamily: "Open Sans",
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
    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
      <Text style={{ ...styles.text, fontWeight: "bold" }}>{label}</Text>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

export default function PDFRelatorioVeiculo() {
  const turn = useRegulacaoSecundariaStore((state) => state.turn);
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;

  const { data } = api.vehicles.getReport.useQuery({ dateRange, turn });

  if (!data || differenceInDays(dateRange.to, dateRange.from) > 1) return null;

  return (
    <PDFModal>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image
              src={logo.src}
              style={{ width: "150px", marginBottom: "10px" }}
            />
            <Text style={styles.title}>
              RELATÓRIO DE ATENDIMENTO DE VEÍCULOS
            </Text>
            <Text style={styles.title}>
              {`De ${format(dateRange.from!, "dd/MM/yyyy")} à ${format(
                dateRange.to!,
                "dd/MM/yyyy",
              )}`}
            </Text>
            <Text style={styles.title}>{`Período: ${turn.label}`}</Text>
            <Text style={styles.title}>
              Data de emissâo: {new Date().toLocaleString()}
            </Text>
          </View>
          <View style={styles.body}>
            {data.map((veiculo) => (
              <View key={veiculo.id}>
                <Text style={styles.decoratedText}>{veiculo.nome}</Text>
                <View style={styles.row}>
                  <View style={{ ...styles.col, flex: 4, padding: 4 }}>
                    <View style={styles.row}>
                      <Text style={{ ...styles.text, fontWeight: "bold" }}>
                        Ocorrência
                      </Text>
                      <Text style={{ ...styles.text, fontWeight: "bold" }}>
                        Paciente
                      </Text>
                    </View>

                    {veiculo.pacientes.map((paciente, i) => (
                      <View style={styles.row} key={paciente.nome + i}>
                        <Text style={styles.text}>
                          #{paciente.ocorrenciaId.toString().slice(2)}
                        </Text>
                        <Text style={styles.text}>
                          {formatProperName(paciente.nome)}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <View
                    style={{
                      flex: 3,
                      borderLeft: 1,
                      borderLeftColor: "black",
                      padding: 4,
                    }}
                  >
                    <Field label="Chegada ao local - QTY QUS: ">
                      {veiculo.QTYQUS} min
                    </Field>
                    <Field label="Atendimento no local - QUS QUY: ">
                      {veiculo.QUSQUY} min
                    </Field>
                    <Field label="Chegada ao destino - QUY QUU: ">
                      {veiculo.QUYQUU} min
                    </Field>
                    <Field label="N° de Ocorrências: ">
                      {veiculo.totalOcorrencias}
                    </Field>
                    <Field label="N° de Pacientes: ">
                      {veiculo.pacientes.length}
                    </Field>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    </PDFModal>
  );
}
