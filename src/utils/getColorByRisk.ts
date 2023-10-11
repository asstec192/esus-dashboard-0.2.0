/**
 * Mapeia os níveis de risco para as cores correspondentes.
 */
const colorByRisk: Record<number, string> = {
  1: "#d25151",
  2: "#e08e0b",
  3: "#51D275",
  4: "#1eb1e7",
};

/**
 * Retorna a cor correspondente a um determinado nível de risco da ocorrencia.
 * @param risk - O nível de risco.
 * @returns {string} A cor correspondente ao nível de risco.
 */
export function getColorByRisk(risk?: number | null) {
  if (!risk) return "black";
  return colorByRisk[risk] ?? "black";
}
