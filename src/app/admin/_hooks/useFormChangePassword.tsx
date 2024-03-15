import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SchemaAlteracaoDeSenhaPeloAdmin } from "@/validators";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import type { z } from "zod";

/**
 * Hook de alteração de senha do usuário pelo administrador
 * @returns o objeto form do react-hook-form e uma funcao para submeter o form
 */
export const useFormChangePassword = (userId: number) => {
  const form = useForm<z.infer<typeof SchemaAlteracaoDeSenhaPeloAdmin>>({
    resolver: zodResolver(SchemaAlteracaoDeSenhaPeloAdmin),
    defaultValues: {
      userId,
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const { mutate } = api.users.changeOtherUserPassword.useMutation({
    onSuccess: () => {
      form.reset();
      toast({ description: "Senha alterada com sucesso" });
    },
    onError: (error) =>
      toast({ description: error.message, variant: "destructive" }),
  });

  const onSubmit = form.handleSubmit((values) => mutate(values));

  return { form, onSubmit };
};
