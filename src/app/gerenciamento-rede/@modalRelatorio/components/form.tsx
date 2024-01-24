"use client";

import { useMask } from "@react-input/mask";
import { RouterOutputs } from "@/trpc/shared";
import { useSession } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";
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
import { useFormRelatorioUnidade } from "../hooks/useFormRelatorioUnidade";
import { GerenciamentoRedeTransferEquipamentos } from "./transferlist-equipamentos";
import { GerenciamentoRedeTransferEspecialidades } from "./transferlist-especialidades";
import { useItensRecentesMutation } from "../hooks/useItensRecentesMutation";

export function GerenciamentoRedeFormRelatorioUnidade({
  initialData,
  hospitais,
}: {
  initialData: RouterOutputs["hospitalManager"]["obterRelatorio"];
  hospitais: RouterOutputs["destinos"]["getAll"];
}) {
  //obtem a sessao ativa
  const session = useSession();

  //obtem o form
  const { form, onSubmit } = useFormRelatorioUnidade(initialData); //caso exista passa os dados iniciais

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

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-full flex flex-col gap-2 md:col-span-1">
            <FormField
              control={form.control}
              name="hospitalId"
              render={() => (
                <FormItem>
                  <FormLabel>Unidade*</FormLabel>
                  <FormControl>
                    <Combobox
                      disabled={!!initialData}
                      defaultValue={initialData?.unidadeId.toString()}
                      options={
                        hospitais?.map((h) => ({
                          value: h.UnidadeCOD.toString(),
                          label: h.UnidadeDS || "UNIDADE SEM DESCRIÇÃO",
                        })) || []
                      }
                      //auto-preenchimento dos ultimos item do hospital
                      onValueChange={(value) => {
                        form.setValue("hospitalId", Number(value));
                        const unidadeId = Number(form.watch("hospitalId"));
                        if (!initialData && unidadeId > 0) {
                          buscarItemsRecentes(unidadeId);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.turno || field.value}
                  >
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
            <FormField
              control={form.control}
              name="obervacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-full flex flex-col gap-4 md:col-span-2">
            <GerenciamentoRedeTransferEquipamentos form={form} />
            <GerenciamentoRedeTransferEspecialidades form={form} />
          </div>
        </div>
        <Button
          className="mt-4 max-w-[300px] self-end"
          type="submit"
          //desabilita ediçao se nao for o mesmo usuario criador
          disabled={
            !!initialData &&
            initialData.criadoPorId.toString() !== session.data?.user.id
          }
        >
          Salvar
        </Button>
      </form>
    </Form>
  );
}
