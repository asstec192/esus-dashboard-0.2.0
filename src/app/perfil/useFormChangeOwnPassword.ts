"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { SchemaAlteracaoDeSenha } from "@/validators";
import { api } from "@/trpc/react";

type FormData = z.infer<typeof SchemaAlteracaoDeSenha>;

export const useFormChangeOwnPassword = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(SchemaAlteracaoDeSenha),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const mutation = api.users.changeOwnPassword.useMutation({
    onSuccess: () => {
      form.reset();
    },
  });

  const onSubmit = (values: FormData) => {
    mutation.mutate(values);
  };

  return { form, mutation, onSubmit };
};
