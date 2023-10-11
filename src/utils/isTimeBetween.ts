/**
 * Verifica se uma data está entre um intervalo de horas estabelecidas
 * @param startHour Hora incial
 * @param endHour Hora final
 * @param date Data a ser verificada
 * @returns
 */
export function isTimeBetween(startHour: number, endHour: number, date: Date) {
  const startDate = new Date(date)
  const endDate = new Date(date)
  startDate.setHours(startHour, 0, 0, 0)
  endDate.setHours(endHour, 0, 0, 0)

  // Se a hora inicial for maior que a final, significa que os horários pertencem a dias diferentes
  // Ex: startHourt = 22 e endHour = 1, quer dizer que endHour esta no dia seguinte ao dia do startHour
  if (startHour > endHour) {
    if (date.getHours() < endHour) {
      //Se a hora da data fornecida for menor que a hora final diminuimos um dia na data inicial
      startDate.setDate(startDate.getDate() - 1)
    } else {
      // Se não aumentamos um dia na data final
      endDate.setDate(endDate.getDate() + 1)
    }
  }

  return date >= startDate && date <= endDate
}
