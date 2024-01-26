/**
 * Verifica se o paciente é menor de 1 ano
 * @param paciente
 */
export const isBelowOneYear = (paciente: Paciente) => {
  return paciente.idadeTipo === "DIA(s)" || paciente.idadeTipo === "MES(es)";
};
