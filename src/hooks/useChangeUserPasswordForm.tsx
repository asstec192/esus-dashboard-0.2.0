import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useManageUsersStore } from "./useManageUsersStore";

export const userPasswordChangeByAdminFormSchema = z
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

type FormData = z.infer<typeof userPasswordChangeByAdminFormSchema>;

export const useChangeUserPasswordForm = () => {
  const selectedUser = useManageUsersStore((state) => state.selectedUser);
  const form = useForm<FormData>({
    resolver: zodResolver(userPasswordChangeByAdminFormSchema),
    defaultValues: {
      selectedUserId: selectedUser?.id,
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const mutation = api.users.changePasswordByAdmin.useMutation({
    onSuccess: (data) => {
      form.reset();
      console.log(data);
    },
  });

  const onSubmit = (values: FormData) => {
    mutation.mutate(values);
  };

  return { form, mutation, onSubmit };
};
