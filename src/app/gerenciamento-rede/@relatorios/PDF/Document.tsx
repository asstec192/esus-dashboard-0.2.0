"use client";

import {
  PDFFooterText,
  PDFHeader,
  PDFLegend,
  PDFParagraph,
  PDFSmall,
  PDFSubTitle,
} from "@/components/PDF/typography";
import { RouterOutputs } from "@/trpc/shared";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import logoMinisterioDaSauda from "public/images/logo-sus.png";
import logoSamu from "public/images/logo-samu-horizontal.png";
import { format } from "date-fns";
import { PMFTimbrado } from "@/components/PDF/PMFTimbrado";

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
          <PDFSubTitle>
            Diagnóstico Situacional da Rede de Urgência e Emergência
          </PDFSubTitle>
          <PDFSubTitle>{format(date, "dd/MM/yyyy")}</PDFSubTitle>
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

function PDFFooter() {
  return (
    <View
      fixed
      style={{
        marginTop: "auto",
      }}
    >
      <View
        style={{
          width: "100%",
          height: 2,
          backgroundColor: "#fbb912",
          marginVertical: 5,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 5,
          backgroundColor: "#fbb912",
        }}
      >
        <Image src={logoMinisterioDaSauda.src} style={{ width: 70 }} />

        <View style={{ alignItems: "center" }}>
          <PDFFooterText>
            Copyright © 2010 — SAMU 192 Fortaleza. Todos os direitos
            reservados.
          </PDFFooterText>
          <PDFFooterText>Rua Pe. Guerra, 1350 Parquelândia</PDFFooterText>
          <PDFFooterText>Telefone (85) 98439-4256 Ouvidoria</PDFFooterText>
          <PDFFooterText>
            diretoria.clinica@samu.fortaleza.ce.gov.br
          </PDFFooterText>
        </View>

        <Image src={logoSamu.src} style={{ width: 70 }} />
      </View>

      <Text
        style={{ fontSize: 10, fontFamily: "Open Sans", textAlign: "right" }}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}
