import { type UserRole } from "./UserRole";

export type EsusUser = {
  OperadorApelido: string;
  OperadorID: number;
  OperadorNM: string;
  ProfisionalTP: UserRole;
};
