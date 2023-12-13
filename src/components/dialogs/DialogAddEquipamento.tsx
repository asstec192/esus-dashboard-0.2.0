import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ProtectedAddButton } from "../buttons/ProtectedAddButon";
import { useRef } from "react";
import { api } from "@/utils/api";

export const DialogAddEquipamento = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const utils = api.useContext();
  const { mutate } = api.hospitalManager.addEquipamento.useMutation({
    onSuccess: () => {
      inputRef.current!.value = "";
      utils.hospitalManager.getEquipamentos.invalidate();
    },
  });
  const onSubmit = () => {
    if (inputRef.current && inputRef.current.value.length > 0) {
      mutate({ descricao: inputRef.current.value });
    }
  };
  return (
    <Dialog>
      <DialogTrigger>
        <ProtectedAddButton className="h-8" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar novo equipamento</DialogTitle>
        </DialogHeader>
        <Input ref={inputRef} placeholder="descrição" />
        <Button onClick={onSubmit}>Confirmar</Button>
      </DialogContent>
    </Dialog>
  );
};
