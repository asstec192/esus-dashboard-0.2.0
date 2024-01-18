"use client";

import {
  PDFFooterText,
  PDFHeader,
  PDFLegend,
  PDFParagraph,
  PDFSmall,
  PDFSubTitle,
  PDFTitle,
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
import logoMinisterioDaSauda from "public/images/logo-ministerio-saude-vertical.png";
import logoSamu from "public/images/logo-samu-horizontal.png";
import { format } from "date-fns";

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

export function GerenciamentoRedePDFRelatorios({
  date,
  hospitais,
}: {
  date: Date;
  hospitais: RouterOutputs["hospitalManager"]["obterRelatoriosAgrupadosPorHospitais"];
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFHeader>
          <PDFTitle>SECRETARIA MUNICIPAL DE SAÚDE</PDFTitle>
          <PDFSubTitle>SAMU 192 FORTALEZA</PDFSubTitle>
          <PDFSubTitle>
            Situação do Plantão Hospitalar em {format(date, "dd/MM/yyyy")}
          </PDFSubTitle>
        </PDFHeader>
        <View style={styles.body}>
          {hospitais &&
            hospitais.map((hospital) => (
              <UnidadeHospitalar hospital={hospital} />
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
  return (
    <View wrap={false}>
      <PDFSubTitle>{hospital.UnidadeDS}</PDFSubTitle>
      {hospital.Relatorios.map((relatorio) => (
        <View style={{ marginLeft: 20, rowGap: 8, marginVertical: 10 }}>
          <PDFSmall>{`${relatorio.turno} - Hora do Contato: ${relatorio.horaContato} - Fone: ${relatorio.contato}`}</PDFSmall>
          <PDFParagraph>
            Pessoa contactada: {relatorio.nomeContato}
          </PDFParagraph>
          <PDFParagraph>Chefe de Equipe: {relatorio.chefeEquipe}</PDFParagraph>
          <View style={{ flexDirection: "row", columnGap: 20, marginLeft: 20 }}>
            <View style={{ rowGap: 8 }}>
              <PDFSmall>RECURSOS DISPONÍVEIS</PDFSmall>
              {relatorio.UnidadeRelatorioEquipamentos.map((eqp) => (
                <PDFParagraph>
                  {`${eqp.quantidade} - ${eqp.equipamento.descricao}`}
                </PDFParagraph>
              ))}
            </View>
            <View style={{ rowGap: 8 }}>
              <PDFSmall>PROFISSIONAIS</PDFSmall>
              {relatorio.UnidadeRelatorioEspecialidades.map((esp) => (
                <PDFParagraph>
                  {`${esp.quantidade} - ${esp.especialidade.descricao}`}
                </PDFParagraph>
              ))}
            </View>
          </View>
          <View style={{ marginLeft: 20, rowGap: 8 }}>
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
      ))}
    </View>
  );
}

function PDFFooter() {
  return (
    <View fixed style={{ marginTop: "auto" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Image src={logoMinisterioDaSauda.src} style={{ width: 60 }} />

        <View style={{ alignItems: "center" }}>
          <PDFFooterText>
            Copyright © 2010 — SAMU 192 Fortaleza. Todos os direitos
            reservados.
          </PDFFooterText>
          <PDFFooterText>Rua Pe. Guerra, 1350 Parquelândia</PDFFooterText>
          <PDFFooterText>Telefone (85) 3452-9140 - Ouvidoria</PDFFooterText>
          <PDFFooterText>setormedico@samu.fortaleza.ce.gov.br</PDFFooterText>
          <PDFFooterText>nep@samu.fortaleza.ce.gov.br</PDFFooterText>
          <PDFFooterText>ti@samu.fortaleza.ce.gov.br</PDFFooterText>
        </View>
        <Image src={logoSamu.src} style={{ width: 60 }} />
      </View>

      <Text
        style={{ fontSize: 10, fontFamily: "Open Sans", textAlign: "right" }}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}
