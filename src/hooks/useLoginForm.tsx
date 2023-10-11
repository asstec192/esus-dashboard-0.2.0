import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  username: z.string().min(1, { message: "Campo Obrigatório" }),
  password: z.string().min(6, { message: "Mínimo de 6 caracteres" }),
});

export type LoginCredentials = z.infer<typeof formSchema>;

export const useLoginForm = () => {
  const form = useForm<LoginCredentials>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  return form;
};
