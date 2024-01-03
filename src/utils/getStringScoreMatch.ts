//@ts-ignore
import commandScore from "command-score";

/**
 * Compara duas strings, e retorna um score entre 0 e 1,
 * sendo 1 o match perfeito e 0 quando não há match. Util para usar em inputs de barra de busca
 * @param value
 * @param search
 * @returns
 */
export function getStringScoreMatches(value: string, search: string) {
  var score: number = commandScore(value, search);
  return score;
}
