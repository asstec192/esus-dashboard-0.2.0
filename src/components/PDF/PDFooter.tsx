import { Image, Text, View } from "@react-pdf/renderer";
import logoSamu from "public/images/logo-samu-horizontal.png";
import logoMinisterioDaSauda from "public/images/logo-sus.png";

import { PDFFooterText } from "./typography";

export function PDFFooter() {
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
            Copyright &copy; 2010 — SAMU 192 Fortaleza. Todos os direitos
            reservados.
          </PDFFooterText>
          <PDFFooterText>Rua Pe. Guerra, 1350 Parquelândia</PDFFooterText>
          <PDFFooterText>Telefone (85) 98439-4256 Ouvidoria</PDFFooterText>
          <PDFFooterText>
            diretoria.tecnica@samu.fortaleza.ce.gov.br
          </PDFFooterText>
        </View>

        <Image src={logoSamu.src} style={{ width: 70 }} />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text
          style={{ fontSize: 8, fontFamily: "Open Sans", textAlign: "left" }}
        >
          Emissão: {new Date().toLocaleString()}
        </Text>
        <Text
          style={{ fontSize: 8, fontFamily: "Open Sans", textAlign: "right" }}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </View>
    </View>
  );
}
