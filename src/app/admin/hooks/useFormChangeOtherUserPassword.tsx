import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useManageUsersStore } from "./useManageUsersStore";
import { formSchemaChangeOtherUserPassword } from "@/constants/zod-schemas";
import { api } from "@/trpc/react";

type FormData = z.infer<typeof formSchemaChangeOtherUserPassword>;

export const useFormChangeOtherUserPassword = () => {
  const selectedUser = useManageUsersStore((state) => state.selectedUser);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchemaChangeOtherUserPassword),
    defaultValues: {
      selectedUserId: selectedUser?.id,
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const mutation = api.users.changeOtherUserPassword.useMutation({
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
