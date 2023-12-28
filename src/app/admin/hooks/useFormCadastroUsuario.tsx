import {
  SignUpCredentials,
  formSchemaCadastroDeUsuario,
} from "@/constants/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";

export const useFormCadastroUsuario = () => {
  const form = useForm<SignUpCredentials>({
    resolver: zodResolver(formSchemaCadastroDeUsuario),
    defaultValues: {
      username: "",
      role: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const utils = api.useUtils();

  const mutation = api.users.create.useMutation();

  function onSubmit(values: SignUpCredentials) {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        utils.users.getAll.invalidate();
      },
    });
  }

  return { form, mutation, onSubmit };
};
