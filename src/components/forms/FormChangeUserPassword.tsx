import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useChangeUserPasswordForm } from "../../hooks/useChangeUserPasswordForm";

export const FormChangeUserPassword = () => {
  const {
    form,
    mutation: { isError, error, isSuccess, data },
    onSubmit,
  } = useChangeUserPasswordForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {isSuccess && (
          <FormMessage className="text-green-400">{data}</FormMessage>
        )}
        {isError && <FormMessage>{error?.message}</FormMessage>}
        <FormField
          control={form.control}
          name="selectedUserId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="nova senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="confirmar nova senha"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Confirmar
        </Button>
      </form>
    </Form>
  );
};
