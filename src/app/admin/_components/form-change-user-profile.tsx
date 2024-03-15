import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { RouterOutputs } from "@/trpc/shared";
import { useFormChangeUserProfile } from "../_hooks/useFormChangeUserProfile";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { formatProperName } from "@/utils/formatProperName";

export function FormChangeUserProfile({
  user,
}: {
  user: RouterOutputs["users"]["all"][0];
}) {
  const { form, onSubmit } = useFormChangeUserProfile(user);
  const { data: roles } = api.roles.getAll.useQuery();

  return (
    <Sheet onOpenChange={(open) => !open && form.reset()}>
      <SheetTrigger asChild>
        <Button variant="secondary">
          <Pencil className="w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Alteração de Perfil</SheetTitle>
          <SheetDescription>
            Preencha os campos abaixo para alterar o perfil de{" "}
            <span className="font-bold">
              {formatProperName(user.operador?.OperadorNM)}
            </span>
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perfil*</FormLabel>
                  <Select
                    value={field.value.toString()}
                    onValueChange={(value) =>
                      form.setValue("roleId", parseInt(value))
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles?.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Salvar
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
