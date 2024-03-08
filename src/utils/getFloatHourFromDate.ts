/**Obtém um valor float de hora a partir de uma data. Exemplo: 2024-03-22 9:30:00 => 9.5*/
export const getFloatHourFromDate = (date: Date): number => {
  return date.getHours() + date.getMinutes() / 60;
};
