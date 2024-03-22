"use client";

import { useMask } from "@react-input/mask";

import type { RouterOutputs } from "@/trpc/shared";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormCombobox } from "@/components/ui/form-combobox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { useFormRelatorioUnidade } from "./_useFormRelatorioUnidade";
import { useItensRecentesMutation } from "./_useItensRecentesMutation";
import { useRelatorioPermissions } from "./_useRelatorioPermissions";
import { TransferEspecialidades } from "./transferlist-especialidades";
import { TransferEquipamentos } from "./transfertlist-equipamentos";

function RelatorioForm({
  relatorioEditavel,
}: {
  relatorioEditavel?: RouterOutputs["hospitalManager"]["obterRelatorios"][0];
}) {
  const { form, onSubmit } = useFormRelatorioUnidade(relatorioEditavel);
  const buscarItemsRecentes = useItensRecentesMutation(form);
  const { canCreate, canEdit } = useRelatorioPermissions(relatorioEditavel);
  const { data: hospitais } = api.destinos.getAll.useQuery();

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
        onSubmit={canEdit || canCreate ? onSubmit : undefined}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-full grid grid-cols-2 gap-2">
            <div>
              <FormCombobox
                form={form}
                name="hospitalId"
                label="Unidade*"
                disabled={!!relatorioEditavel}
                options={
                  hospitais?.map((h) => ({
                    value: h.UnidadeCOD,
                    label: h.UnidadeDS ?? "UNIDADE SEM DESCRIÇÃO",
                  })) ?? []
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
                    <Select value={field.value} onValueChange={field.onChange}>
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
          <Button className="max-w-[300px] self-end" type="submit">
            Salvar
          </Button>
          {relatorioEditavel ? (
            <DialogDescription>
              Criado por {relatorioEditavel.criadoPor.operador?.OperadorNM} em{" "}
              {relatorioEditavel.createdAt.toLocaleString()}. <br />
              Editado pela última vez por{" "}
              {relatorioEditavel.editadoPor.operador?.OperadorNM} em{" "}
              {relatorioEditavel.updatedAt.toLocaleString()}.
            </DialogDescription>
          ) : null}
        </div>
      </form>
    </Form>
  );
}

export { RelatorioForm };
