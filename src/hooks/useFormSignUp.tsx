import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z
  .object({
    username: z.string().nonempty({ message: "Campo obrigatório!" }),
    role: z.string().nonempty({ message: "Campo obrigratório!" }),
    password: z
      .string()
      .min(6, { message: "A senha deve possuir no mínimo 6 caracteres!" }),
    passwordConfirm: z
      .string()
      .min(1, { message: "É necessário confirmar a senha!" }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "As senhas não correspondem!",
  });

export type SignUpCredentials = z.infer<typeof formSchema>;

export const useFormSignUp = () => {
  const form = useForm<SignUpCredentials>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      role: "",
      password: "",
      passwordConfirm: "",
    },
  });
  return form;
};
