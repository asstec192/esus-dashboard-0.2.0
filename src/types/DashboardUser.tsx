export type DashboardUser = {
  operador: {
    OperadorNM: string | null;
    OperadorApelido: string | null;
  } | null;
} & {
  id: number;
  operadorID: number;
  senha: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};
