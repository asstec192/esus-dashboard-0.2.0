"use client";

import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";

import type { RouterOutputs } from "@/trpc/shared";
import { PDFFooter } from "@/components/PDF/PDFooter";
import { PMFTimbrado } from "@/components/PDF/PMFTimbrado";
import {
  PDFHeader,
  PDFLegend,
  PDFParagraph,
  PDFSmall,
  PDFSubTitle,
} from "@/components/PDF/typography";

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
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-italic.ttf",
      fontWeight: 400,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  body: {
    flexDirection: "column",
    rowGap: 20,
  },
});

export type PDFRelatorioRedeProps = {
  date: Date;
  pdfData?: RouterOutputs["hospitalManager"]["obterRelatoriosAgrupadosPorHospitais"];
};

export function GerenciamentoRedePDFRelatorios({
  date,
  pdfData,
}: PDFRelatorioRedeProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFHeader>
          <PMFTimbrado />
          <PDFSubTitle>
            Central de Regulação das Urgências de Fotaleza
          </PDFSubTitle>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "semibold",
              fontFamily: "Open Sans",
              marginTop: 10,
            }}
          >
            Diagnóstico Situacional da Rede de Urgência e Emergência
          </Text>
          <PDFSmall>{format(date, "dd/MM/yyyy")}</PDFSmall>
        </PDFHeader>
        <View style={styles.body}>
          {pdfData &&
            pdfData.map((hospital) => (
              <UnidadeHospitalar
                key={hospital.UnidadeCOD}
                hospital={hospital}
              />
            ))}
        </View>
        <PDFFooter />
      </Page>
    </Document>
  );
}

function UnidadeHospitalar({
  hospital,
}: {
  hospital: RouterOutputs["hospitalManager"]["obterRelatoriosAgrupadosPorHospitais"][0];
}) {
  return hospital.Relatorios.map((relatorio, i) => (
    <View wrap={false}>
      {i === 0 ? <PDFSubTitle>{hospital.UnidadeDS}</PDFSubTitle> : null}
      <View
        key={relatorio.id}
        style={{ marginLeft: 20, rowGap: 8, marginVertical: 5 }}
      >
        <PDFSmall>{`${relatorio.turno} - Hora do Contato: ${relatorio.horaContato} - Fone: ${relatorio.contato}`}</PDFSmall>
        <PDFParagraph>Pessoa contactada: {relatorio.nomeContato}</PDFParagraph>
        <PDFParagraph>Chefe de Equipe: {relatorio.chefeEquipe}</PDFParagraph>
        <View style={{ flexDirection: "row", columnGap: 20, marginLeft: 20 }}>
          <View style={{ rowGap: 8 }}>
            <PDFSmall>RECURSOS DISPONÍVEIS</PDFSmall>
            {relatorio.UnidadeRelatorioEquipamentos.map((eqp) => (
              <PDFParagraph key={eqp.equipamentoId}>
                {`${eqp.quantidade} - ${eqp.equipamento.descricao}`}
              </PDFParagraph>
            ))}
          </View>
          <View style={{ rowGap: 8 }}>
            <PDFSmall>PROFISSIONAIS</PDFSmall>
            {relatorio.UnidadeRelatorioEspecialidades.map((esp) => (
              <PDFParagraph key={esp.especialidadeId}>
                {`${esp.quantidade} - ${esp.especialidade.descricao}`}
              </PDFParagraph>
            ))}
          </View>
        </View>

        <View style={{ marginLeft: 20, marginBottom: 8, rowGap: 8 }}>
          <PDFSmall>INTERCORRÊNCIAS</PDFSmall>
          <PDFParagraph>
            {relatorio.observacao?.trim() === ""
              ? "PLANTÃO TRANSCORRENDO NORMALMENTE, SEM INTERCORRÊNCIAS."
              : relatorio.observacao}
          </PDFParagraph>
        </View>
        <PDFLegend>
          Responsável pela informação:{" "}
          {relatorio.criadoPor.operador?.OperadorNM}
        </PDFLegend>
      </View>
    </View>
  ));
}
