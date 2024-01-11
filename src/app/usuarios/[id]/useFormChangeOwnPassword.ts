"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { formSchemaChangeOwnPassword } from "@/constants/zod-schemas";
import { api } from "@/trpc/react";

type FormData = z.infer<typeof formSchemaChangeOwnPassword>;

export const useFormChangeOwnPassword = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchemaChangeOwnPassword),
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
