//O QUE O BANCO RETORNA
type RelatorioVeiculo = {
  id: number;
  nome: string;
  QTYQUS?: number;
  QUSQUY?: number;
  QUYQUU?: number;
  totalOcorrencias: number;
  pacientes: string;
};

//RETORNO APOS PARSE DOS PACIENTES
type PacientesVeiculo = {
  ocorrenciaId: BigInt;
  nome: string;
};
