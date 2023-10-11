import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

export const changePasswordFormSchema = z
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

type FormData = z.infer<typeof changePasswordFormSchema>;

export const useChangePasswordForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const mutation = api.users.changePassword.useMutation({
    onSuccess: () => {
      form.reset();
    },
  });

  const onSubmit = (values: FormData) => {
    mutation.mutate(values);
  };

  return { form, mutation, onSubmit };
};
