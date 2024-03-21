"use client";

import type { z } from "zod";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { TypographyH3 } from "@/components/typography/TypographyH3";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchemaLogin } from "@/validators";

type LoginCredentials = z.infer<typeof formSchemaLogin>;

export default function Login() {
  const params = useSearchParams();
  const error = params.get("error");
  const form = useForm<LoginCredentials>({
    resolver: zodResolver(formSchemaLogin),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginCredentials) => {
    await signIn("credentials", {
      callbackUrl: "/dashboard",
      ...values,
    });
  };

  return (
    <main className="flex min-h-nav-offset flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <TypographyH3 className="text-center">Login</TypographyH3>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormMessage>
                {error && "Erro ao realizar login. Verifique as credenciais"}
              </FormMessage>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuário e-SUS SAMU*</FormLabel>
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
    </main>
  );
}
