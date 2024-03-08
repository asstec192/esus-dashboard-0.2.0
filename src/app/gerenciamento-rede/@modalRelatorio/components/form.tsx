"use client";

import { api } from "@/trpc/react";
import { differenceInHours } from "date-fns";
import { useMask } from "@react-input/mask";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useItensRecentesMutation } from "../hooks/useItensRecentesMutation";
import { useFormRelatorioUnidade } from "../hooks/useFormRelatorioUnidade";

import { type RouterOutputs } from "@/trpc/shared";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TransferEquipamentos } from "./transfertlist-equipamentos";
import { TransferEspecialidades } from "./transferlist-especialidades";
import { DialogDescription } from "@/components/ui/dialog";
import { FormCombobox } from "@/components/ui/form-combobox";

export function GerenciamentoRedeFormRelatorioUnidade({
  initialData,
  hospitais,
}: {
  initialData: RouterOutputs["hospitalManager"]["obterRelatorio"];
  hospitais: RouterOutputs["destinos"]["getAll"];
}) {
  //obtem a sessao ativa
  const session = useSession();
  const params = useSearchParams();
  const relatorioId = Number(params.get("relatorioId"));

  const { data: relatorio } = api.hospitalManager.obterRelatorio.useQuery(
    { relatorioId },
    { initialData, enabled: !!relatorioId },
  );

  //obtem o form
  const { form, onSubmit } = useFormRelatorioUnidade(relatorio); //caso exista passa os dados iniciais

  //hooks para buscar o ultimo registro de items de uma unidade
  const buscarItemsRecentes = useItensRecentesMutation(form);

  //máscara do campo de telefone
  const foneRef = useMask({
    modify: (value) => ({
      mask: value[2] === "9" ? "(__) _____-____" : undefined, //se for celular acrescenta 1 digito à mascara
    }),
    mask: "(__) ____-____",
    replacement: { _: /\d/ },
  });

  // Habilita edição do formulario
  const editionExpired =
    relatorio && differenceInHours(new Date(), relatorio.createdAt) > 12;
  const isAuthor = relatorio?.criadoPorId.toString() === session.data?.user.id;
  const editionEnabled = isAuthor && !editionExpired;

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-full grid grid-cols-2 gap-2">
            <div>
              <FormCombobox
                form={form}
                name="hospitalId"
                label="Unidade*"
                disabled={!!relatorio}
                options={
                  hospitais?.map((h) => ({
                    value: h.UnidadeCOD,
                    label: h.UnidadeDS || "UNIDADE SEM DESCRIÇÃO",
                  })) || []
                }
                onValueChange={(option) => {
                  buscarItemsRecentes(Number(option?.value));
                }}
              />

              <FormField
                control={form.control}
                name="foneContato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fone de Contato*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        ref={foneRef}
                        placeholder="(85) 98888-8888"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="turno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turno*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="T0">T0</SelectItem>
                        <SelectItem value="T1">T1</SelectItem>
                        <SelectItem value="T2">T2</SelectItem>
                        <SelectItem value="T3">T3</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="horaContato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora do Contato*</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pessoaContactada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pessoa Contactada*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chefeEquipe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chefe de Equipe*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="obervacao"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Textarea className="flex-grow" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-full flex flex-col gap-4 md:col-span-2">
            <TransferEquipamentos form={form} />
            <TransferEspecialidades form={form} />
          </div>
        </div>

        <div className="flex flex-row-reverse items-center justify-between">
          <Button
            className="max-w-[300px] self-end"
            type="submit"
            disabled={!editionEnabled}
          >
            Salvar
          </Button>
          {relatorio && (
            <DialogDescription>
              Criado por {relatorio.criadoPor.operador?.OperadorNM} em{" "}
              {relatorio.createdAt.toLocaleString()}. <br />
              Editado pela última vez por{" "}
              {relatorio.editadoPor.operador?.OperadorNM} em{" "}
              {relatorio.updatedAt.toLocaleString()}.
            </DialogDescription>
          )}
        </div>
      </form>
    </Form>
  );
}
