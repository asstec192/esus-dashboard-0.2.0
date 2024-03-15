import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";
import { SchemaAleracaoDeRole } from "@/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export function useFormChangeUserProfile(
  user: RouterOutputs["users"]["all"][0],
) {
  const form = useForm<z.infer<typeof SchemaAleracaoDeRole>>({
    resolver: zodResolver(SchemaAleracaoDeRole),
    values: {
      userId: user.id,
      roleId: user.role,
    },
  });

  const utils = api.useUtils();
  const { mutate } = api.users.update.useMutation({
    onSuccess: async () => {
      toast({ description: "O perfil do usuário foi alterado com sucesso" }),
        await utils.users.all.invalidate();
    },
    onError: (error) =>
      toast({ description: error.message, variant: "destructive" }),
  });

  const onSubmit = form.handleSubmit((values) => mutate(values));

  return { form, onSubmit };
}
