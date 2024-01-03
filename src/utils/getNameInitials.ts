export function getNameInitials(username: string) {
  // Calcula a sigla do nome do usuário (por exemplo, "carlos.david" => "CD")
  const nameParts = username.split(".");
  const userInitials = nameParts
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return userInitials;
}
