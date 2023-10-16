import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type SignInResponse, signIn } from "next-auth/react";
import { type LoginCredentials, useLoginForm } from "../hooks/useLoginForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TypographyH4 } from "@/components/typography/TypographyH4";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const form = useLoginForm();
  const router = useRouter();
  const [data, setData] = useState<SignInResponse>();
  const onSubmit = async (values: LoginCredentials) => {
    const res = await signIn("credentials", {
      redirect: true,
      callbackUrl: "/monitoramento",
      ...values,
    });
    /*  if (res?.ok) {
      return router.replace("/monitoramento");
    } */
    setData(res);
  };
  return (
    <div className="flex h-[calc(100vh-var(--nav))] items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <TypographyH4>Faça login</TypographyH4>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormMessage>
                {data &&
                  !data.ok &&
                  "Erro ao realizar login. Verifique as credenciais"}
              </FormMessage>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuário e-SUS SAMU*</FormLabel>
                    <FormMessage>
                      {form.getFieldState("username").error?.message}
                    </FormMessage>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Senha*</FormLabel>
                    <FormMessage>
                      {form.getFieldState("password").error?.message}
                    </FormMessage>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="mt-6 w-full" type="submit">
                Entrar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
