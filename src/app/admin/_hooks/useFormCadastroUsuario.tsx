import { SchemaCadastroDeUsuario } from "@/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import type { z } from "zod";
import { toast } from "@/components/ui/use-toast";

export const useFormCadastroUsuario = () => {
  const form = useForm<z.infer<typeof SchemaCadastroDeUsuario>>({
    resolver: zodResolver(SchemaCadastroDeUsuario),
    defaultValues: {
      username: "",
      roleId: 4,
      password: "",
      passwordConfirm: "",
    },
  });

  const utils = api.useUtils();

  const { mutate } = api.users.create.useMutation({
    onSuccess: async () => {
      form.setFocus("username");
      form.reset();
      toast({ description: "Usuário cadastrado com sucesso" });
      await utils.users.all.invalidate();
    },
    onError: (error) =>
      toast({ description: error.message, variant: "destructive" }),
  });

  const onSubmit = form.handleSubmit((values) => mutate(values));

  return { form, onSubmit };
};
