export function extractFirstAndLastNames(fullName: string) {
  const namesArray = fullName.split(" ") // Divide o nome em partes

  if (namesArray.length === 0) {
    return "" // Retorno vazio se não houver nome
  }

  const isOnlyOneName = namesArray.length === 1
  const firstName = namesArray[0]
  const lastName = isOnlyOneName ? "" : namesArray[namesArray.length - 1]

  return `${firstName} ${lastName}`
}
