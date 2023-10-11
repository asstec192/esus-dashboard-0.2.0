import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types/UserRole";
import { SignUpCredentials, useSignUpForm } from "@/hooks/useSignUpForm";
import { useSignUpMutation } from "@/hooks/useSignUpMutation";

export function SignUpForm() {
  const form = useSignUpForm();
  const { mutate, isError, error, isSuccess } = useSignUpMutation();

  function onSubmit(values: SignUpCredentials) {
    mutate(values, { onSuccess: () => form.reset() });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormMessage>{isError && (error as Error).message}</FormMessage>
        <FormMessage className="text-green-500">
          {isSuccess && "Usuário cadastrado com sucesso!"}
        </FormMessage>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuário*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Utilize o mesmo nome de usuário usado na plataforma e-sus SAMU
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Senha*</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Confirmar senha*</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="mt-4">
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Funções</SelectLabel>
                    <SelectItem value={UserRole.admin}>
                      Administrador
                    </SelectItem>
                    <SelectItem value={UserRole.medico}>Médico</SelectItem>
                    <SelectItem value={UserRole.radioOperador}>
                      Radio Operador
                    </SelectItem>
                    <SelectItem value={UserRole.tarm}>TARM</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-6 w-full" type="submit">
          Cadastrar
        </Button>
      </form>
    </Form>
  );
}
