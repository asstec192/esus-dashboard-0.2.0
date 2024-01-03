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
import { useFormCadastroUsuario } from "../hooks/useFormCadastroUsuario";
import { api } from "@/trpc/react";

export function AdminFormCadastroUsuario() {
  const {
    form,
    mutation: { isError, error, isSuccess },
    onSubmit,
  } = useFormCadastroUsuario();

  const { data: roles } = api.roles.getAll.useQuery();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormMessage>{isError && error?.message}</FormMessage>
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
                    <SelectLabel>Perfis</SelectLabel>
                    {roles?.map((role) => (
                      <SelectItem value={role.id.toString()}>
                        {role.descricao}
                      </SelectItem>
                    ))}
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
