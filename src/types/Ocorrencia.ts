type OcorrenciaRaw = {
  id: bigint;
  data: Date | null;
  bairro: string | null;
  risco: number | null;
  motivo: string | null;
  operador: string | null;
  vitimas: string;
  veiculos: string;
};

type Ocorrencia = {
  id: string;
  data: Date | null;
  bairro: string;
  risco: number | null;
  motivo: string | null;
  riscoColorClass: {
    text: string;
    fill: string;
  };
  operador: string;
  pacientes: Paciente[];
  veiculos: Veiculo[];
};

type Paciente = {
  nome: string | null;
  sexo: "1" | "2";
  idade: number | null;
  idadeTipo: "DIA(s)" | "MES(es)" | "ANO(s)";
};

type Veiculo = {
  EnvioEquipeDT: string | null;
  ChegadaBaseDT: string | null;
  ChegadaDestinoDT: string | null;
  ChegadaLocalDT: string | null;
  SaidaBaseDT: string | null;
  RetornoDestinoDT: string | null;
  SaidaLocalDT: string | null;
  nome: string | null;
  status: "O" | "P" | "L";
};
