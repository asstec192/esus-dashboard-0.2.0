import * as z from "zod";

export const dateRangeSchema = z.object({ from: z.date(), to: z.date() });

export const turnoSchema = z.object({
  from: z.number(),
  to: z.number(),
  label: z.string(),
  category: z.enum(["tarm", "veiculo"])
});

export const formSchemaLogin = z.object({
  username: z.string().min(1, { message: "Campo Obrigatório" }),
  password: z.string().min(6, { message: "Mínimo de 6 caracteres" }),
});

const hospitalItemSchema = z.object({
  itemDescription: z.string(),
  itemId: z.number(),
  itemCount: z.string(),
});
export type HospitalItem = z.infer<typeof hospitalItemSchema>;

const telefonePattern = /^\(\d{2}\) \d{4}-\d{4}$/;

export const formSchemaRelatorioHospital = z.object({
  relatorioId: z.number(),
  hospitalId: z.number().min(1),
  equipamentos: z.array(hospitalItemSchema),
  especialidades: z.array(hospitalItemSchema),
  foneContato: z.string().refine((data) => telefonePattern.test(data), {
    message: "Número de telefone inválido. Use o formato (XX) XXXX-XXXX.",
  }),
  horaContato: z.string().min(5),
  pessoaContactada: z.string().min(1),
  chefeEquipe: z.string().min(1),
  obervacao: z.string().optional(),
  turno: z.string().min(1),
  createdAt: z.date()
});
export type SchemaRelatorioHospital = z.infer<
  typeof formSchemaRelatorioHospital
>;

export const formSchemaChangeOwnPassword = z
  .object({
    password: z.string(),
    newPassword: z.string().min(6, { message: "Mínimo de 6 caracteres!" }),
    confirmNewPassword: z
      .string()
      .min(1, { message: "É necessário confirmar a senha!" }),
  })
  .refine((fields) => fields.newPassword === fields.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "As senhas não correspondem!",
  });

export const formSchemaChangeOtherUserPassword = z
  .object({
    selectedUserId: z.number(),
    newPassword: z.string().min(6, { message: "Mínimo de 6 caracteres!" }),
    confirmNewPassword: z
      .string()
      .min(1, { message: "É necessário confirmar a senha!" }),
  })
  .refine((fields) => fields.newPassword === fields.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "As senhas não correspondem!",
  });

export const formSchemaCadastroDeUsuario = z
  .object({
    username: z.string().min(1, "Campo obrigatório!"),
    role: z.string().min(1, "Campo obrigratório!"),
    password: z.string().min(6, "A senha deve possuir no mínimo 6 caracteres!"),
    passwordConfirm: z.string().min(1, "É necessário confirmar a senha!"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "As senhas não correspondem!",
  });

export type SignUpCredentials = z.infer<typeof formSchemaCadastroDeUsuario>;
