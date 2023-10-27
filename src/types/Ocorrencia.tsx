type Ocorrencia = {
  id: string;
  data: Date;
  bairro: string;
  risco: number;
  operador: string | null;
  motivo?: string;
  veiculos: Veiculo[];
  pacientes: Paciente[];
};

type OcorrenciaEmAndamento = Omit<Ocorrencia, "data" | "pacientes">;

type Veiculo = {
  EnvioEquipeDT: Date;
  SaidaBaseDT?: Date;
  nome: string;
  ChegadaLocalDT?: Date;
  RetornoDestinoDT?: Date;
  SaidaLocalDT?: Date;
  ChegadaDestinoDT?: Date;
  ChegadaBaseDT?: Date;
};

type Paciente = {
  nome: string;
  sexo?: string; // é a string de um numero
  idade?: number;
  idadeTipo?: string;
};
