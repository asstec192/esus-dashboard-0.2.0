import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useFormChangePassword } from "../_hooks/useFormChangePassword";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { KeyRound } from "lucide-react";
import type { RouterOutputs } from "@/trpc/shared";
import { formatProperName } from "@/utils/formatProperName";

export function FormChangeUserPassword({
  user,
}: {
  user: RouterOutputs["users"]["all"][0];
}) {
  const { form, onSubmit } = useFormChangePassword(user.id);

  return (
    <Sheet onOpenChange={(open) => !open && form.reset()}>
      <SheetTrigger>
        <Button variant="secondary">
          <KeyRound className="w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Alteração de Senha</SheetTitle>
          <SheetDescription>
            Preencha os campos abaixo para alterar a senha de{" "}
            <span className="font-bold">
              {formatProperName(user.operador?.OperadorNM)}
            </span>
            .
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
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
                  <FormLabel>Nova Senha*</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
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
                  <FormLabel>Confirmar Senha*</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
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
      </SheetContent>
    </Sheet>
  );
}
