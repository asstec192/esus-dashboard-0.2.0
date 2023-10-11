import {
  createDashboardUser,
  findDashboardUser,
  findEsusUserByCodeName,
} from "@/lib/user";
import { UserRole } from "@/types/UserRole";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { username, password, role } = req.body as {
      username: string;
      password: string;
      role: UserRole;
    };
    const esusUser = await findEsusUserByCodeName(username);
    if (!esusUser) {
      return res
        .status(401)
        .json("O usuário informado não existe na plataforma e-SUS SAMU!");
    }
    const existingDashboardUser = await findDashboardUser(esusUser.OperadorID);
    if (existingDashboardUser) {
      return res.status(401).json("Usuário já cadastrado.");
    }
    await createDashboardUser(esusUser.OperadorID, password, role);
    res.status(200).json("Usuário cadastrado com sucesso.");
  } catch (error) {
    console.log("Erro ao cadastrar usuário:", error);
    res
      .status(500)
      .json("Houve um erro ao cadastrar usuário. Tente mais tarde.");
  }
}
