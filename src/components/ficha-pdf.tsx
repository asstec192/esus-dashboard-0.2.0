import { api } from "@/utils/api";
import { addHours } from "date-fns";
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
    width: "33.33%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
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

export const FichaPDF = () => {
  const { data: ocorrencia } = api.incidents.getOne.useQuery({
    incidentId: 2211010004,
  });
  return (
    <PDFViewer className="h-[800px] w-full">
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.subtitle}>SAMU 192</Text>
            <Text style={styles.subtitle}>FICHA DE RECULACAO - SAMU 192</Text>
            <Text style={styles.subtitle}>Data de emissão:</Text>
          </View>
          {/* ----------------- Dados da ocorrencia ---------------------*/}
          <View style={styles.section}>
            <Text style={styles.subtitle}>DADOS DA OCORRÊNCIA</Text>
            <View style={{ ...styles.row, justifyContent: "space-between" }}>
              <View style={styles.col}>
                <Field label="N° da Ocorrencia:">
                  {ocorrencia?.OcorrenciaID.toString()}
                </Field>
                <Field label="Operador:">
                  {
                    ocorrencia?.FORMEQUIPE_SolicitacaoVeiculo[0]?.Operador
                      ?.OperadorNM
                  }
                </Field>
                <Field label="Início:">
                  {addHours(ocorrencia?.DtHr!, 3).toLocaleString()}
                </Field>
                <Field label="Término:">
                  {ocorrencia?.OcorrenciaFinalDT &&
                    addHours(ocorrencia.OcorrenciaFinalDT, 3).toLocaleString()}
                </Field>
              </View>
              <View style={styles.col}>
                <Field label="Total de vítimas:">
                  {ocorrencia?.Vitimas.length}
                </Field>
                <Field label="Classificação de risco:">
                  {ocorrencia?.CLASSIFICACAO_RISCO?.RISCODS}
                </Field>
                <Field label="Tipo:"> {ocorrencia?.Tipo?.TipoDS}</Field>
                <Field label="Motivo:">{ocorrencia?.Motivo?.MotivoDS}</Field>
              </View>
              <View style={styles.col}>
                <Field label="Endereço:">
                  {ocorrencia?.Logradouro_?.Abreviatura}{" "}
                  {ocorrencia?.Logradouro}, {ocorrencia?.Numero}
                </Field>
                <Field label="Bairro:"> {ocorrencia?.Bairro}</Field>
                <Field label="Cidade:">
                  {ocorrencia?.Municipio?.Municipio}
                </Field>
                <Field label="Ponto de Referência:">
                  {ocorrencia?.ReferenciaDS}
                </Field>
              </View>
            </View>
          </View>
          {/* ---------------------------DADOS DA LIGACAO---------------------------- */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>DADOS DA LIGAÇÃO</Text>
            <View style={styles.col}>
              <Field label="Solicitante:">
                {ocorrencia?.Solicitante?.SolicitanteNM}
              </Field>
              <Field label="Tipo de Ligação:">
                {ocorrencia?.Ligacao?.LigacaoTPDS}
              </Field>
              <Field label="Telefone do solicitante:">
                ({ocorrencia?.Solicitante?.TelefoneDDD}){" "}
                {ocorrencia?.Solicitante?.TelefoneNM}
              </Field>
              <Field label="Origem da Ligacao:">
                {ocorrencia?.Origem?.OrigemOcoDS}
              </Field>
              <Field label="Queixa">: {ocorrencia?.QueixaDS}</Field>
            </View>
          </View>
          {/* -------------------DADOS DA VITIMA------------------------- */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>VITIMAS</Text>
            <View>
              {ocorrencia?.Vitimas.map((vitima) => (
                <View style={styles.col} key={vitima.VitimaId}>
                  <Text style={styles.subtitle}>{vitima.VitimaNM}</Text>
                  <View style={{ ...styles.row, alignItems: "flex-end" }}>
                    <Field label="Classificação:">
                      {vitima.Classificacao?.ClassifVitimaDS}
                    </Field>
                    <Field label="Idade:">
                      {vitima.Idade}{" "}
                      {vitima.IdadeTP_Vitimas_IdadeTPToIdadeTP?.IdadeTPDS}
                    </Field>
                    <Field label="Sexo:"> {vitima.Sexo}</Field>
                  </View>
                  <View style={styles.col}>
                    <Text style={styles.subtitle}>
                      AVALIAÇÃO NÃO ESTRUTURADA
                    </Text>
                    <View style={styles.col}>
                      {vitima.OCORRENCIA_AVALIACAO_INICIAL.map((avaliacao) => (
                        <View
                          style={{
                            ...styles.col,
                            backgroundColor: "lightgray",
                            padding: 4,
                          }}
                        >
                          <Field label="Profissional:">
                            {avaliacao.Operador?.OperadorNM}
                          </Field>
                          <Text style={styles.p}>{avaliacao.AVALICAO}</Text>
                          <Text style={{ textAlign: "right", fontSize: 10 }}>
                            {addHours(avaliacao.DTHR, 3).toLocaleString()}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {vitima.HistoricoDecisaoGestora.map((historico) => (
                    <View style={styles.table} key={historico.DECISAOID}>
                      <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}></Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>Decisão</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>Destino</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>Intercorrência</Text>
                        </View>
                      </View>
                      <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>Descrição</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {historico.Decisao?.TransporteDS}
                          </Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {historico.Destino?.UnidadeDS}
                          </Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {historico.Intercorrencia?.IntercorrenciaDS}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>Profissional</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {historico.OperadorDecisao?.OperadorNM}
                          </Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {historico.OperadorDestino?.OperadorNM}
                          </Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {historico.OperadorIntercorrencia?.OperadorNM}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>Data</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {historico.DTHR_DECISAO_GESTORAID &&
                              addHours(
                                historico.DTHR_DECISAO_GESTORAID,
                                3,
                              ).toLocaleString()}
                          </Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {historico.DTHR_DESTINOID &&
                              addHours(
                                historico.DTHR_DESTINOID,
                                3,
                              ).toLocaleString()}
                          </Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {historico.DTHR_INTERCORRENCIAID &&
                              addHours(
                                historico.DTHR_INTERCORRENCIAID,
                                3,
                              ).toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
          {/* -------------------DADOS DOS VEICULOS------------------------- */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>MOVIMENTAÇÃO DE VEÍCULO</Text>
            <View style={styles.col}>
              {ocorrencia?.OcorrenciaMovimentacao.map((movimentacao) => (
                <View
                  key={movimentacao.VeiculoID}
                  style={{
                    ...styles.row,
                    backgroundColor: "lightgray",
                    padding: 4,
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      backgroundColor: "#c40e2f",
                      borderRadius: 4,
                    }}
                  >
                    <Text style={styles.subtitle}>
                      SEQ {movimentacao.VeiculoSEQ}
                    </Text>
                  </View>

                  <View style={{ ...styles.col, justifyContent: "center" }}>
                    <Text
                      style={{
                        ...styles.small,
                        textAlign: "center",
                        textDecoration: "underline",
                      }}
                    >
                      {movimentacao.Veiculo?.VeiculoDS}
                    </Text>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Field label="Envio de equipe:">
                          {movimentacao.EnvioEquipeDT &&
                            addHours(
                              movimentacao.EnvioEquipeDT,
                              3,
                            ).toLocaleString()}
                        </Field>
                        <Field label="Chegada ao local:">
                          {movimentacao.ChegadaLocalDT &&
                            addHours(
                              movimentacao.ChegadaLocalDT,
                              3,
                            ).toLocaleString()}
                        </Field>
                        <Field label="Chegada ao destino:">
                          {movimentacao.ChegadaDestinoDT &&
                            addHours(
                              movimentacao.ChegadaDestinoDT,
                              3,
                            ).toLocaleString()}
                        </Field>
                        <Field label="Chegada à base:">
                          {movimentacao.ChegadaBaseDT &&
                            addHours(
                              movimentacao.ChegadaBaseDT,
                              3,
                            ).toLocaleString()}
                        </Field>
                      </View>
                      <View style={styles.col}>
                        <Field label="Saída da base:">
                          {movimentacao.SaidaBaseDT &&
                            addHours(
                              movimentacao.SaidaBaseDT,
                              3,
                            ).toLocaleString()}
                        </Field>
                        <Field label="Saída do local:">
                          {movimentacao.SaidaLocalDT &&
                            addHours(
                              movimentacao.SaidaLocalDT,
                              3,
                            ).toLocaleString()}
                        </Field>
                        <Field label="Saída do destino:">
                          {movimentacao.RetornoDestinoDT &&
                            addHours(
                              movimentacao.RetornoDestinoDT,
                              3,
                            ).toLocaleString()}
                        </Field>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
          {/* -------------------MOVIMENTACAO DA OCORRENCIA------------------------- */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>MOVIMENTAÇÃO INTERNA</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Origem</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Destino</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Data</Text>
                </View>
              </View>
              {ocorrencia?.PosicaoOcorrencias.map((movimentacao, i) => (
                <View style={styles.tableRow} key={i}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {movimentacao.OpOrigem?.OperadorNM}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {movimentacao.OpDestino?.OperadorNM}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {movimentacao.DestinoDTHR &&
                        addHours(movimentacao.DestinoDTHR, 3).toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
