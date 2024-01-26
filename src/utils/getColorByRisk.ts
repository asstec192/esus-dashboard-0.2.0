/**
 * Mapeia os níveis de risco para as cores correspondentes.
 */
const textClass: Record<number, string> = {
  1: "text-primary",
  2: "text-yellow-500",
  3: "text-green-400",
  4: "text-blue-400",
};

const fillClass: Record<number, string> = {
  1: "fill-primary",
  2: "fill-yellow-500",
  3: "fill-green-400",
  4: "fill-blue-400",
};

/**
 * Retorna a cor correspondente a um determinado nível de risco da ocorrencia.
 * @param risk - O nível de risco.
 * @returns Um objeto contendo as classes tailwind para text e fill da cor correspondente ao nível de risco.
 */
export function getColorByRisk(risk?: number | null) {
  return {
    text: (risk ? textClass[risk] : "text-foreground") ?? "text-foreground",
    fill: (risk ? fillClass[risk] : "fill-foreground") ?? "fill-foreground",
  };
}
