/**
 * Formata nomes própios
 * @param name Nome a ser formatado
 * @returns O nome formatado em lower case com primeira letra em maiúsculo
 */
export const formatProperName = (name?: string | null) => {
  if (!name) return "";
  const words = name.toLowerCase().split(" ");
  const formatedName = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return formatedName;
};
