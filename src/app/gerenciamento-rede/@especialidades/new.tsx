import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";

export const GerenciamentoRedeAddEspecialidade = () => {
  const [openInput, setOpenInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useClickOutside<HTMLDivElement>(() => setOpenInput(false));
  const utils = api.useContext();

  const { mutate } = api.hospitalManager.addEspecialidade.useMutation({
    onSuccess: () => {
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
      utils.hospitalManager.getEspecialidades.invalidate();
      toast({ description: "Especialidade adicionada com sucesso!" });
    },
    onError: () =>
      toast({
        description: "Ocorreu um erro interno ao adicionar a especialidade!",
        variant: "destructive",
      }),
  });

  const onSubmit = () => {
    if (inputRef.current && inputRef.current.value.trim() !== "") {
      mutate({ descricao: inputRef.current.value });
    }
  };

  const onOpenInput = () => {
    inputRef.current?.focus();
    setOpenInput(true);
  };

  return (
    <div className="flex gap-2" ref={divRef}>
      <Input
        ref={inputRef}
        placeholder="nome da especialidade"
        className={cn(
          "h-8 w-0 transition-all",
          openInput
            ? "visible w-[150px] duration-300 ease-in lg:w-[250px]"
            : "duration-50 invisible delay-100 ease-out",
        )}
      />
      <Button
        className="h-8 w-16"
        onClick={() => (openInput ? onSubmit() : onOpenInput())}
      >
        {openInput ? "Salvar" : <Plus />}
      </Button>
    </div>
  );
};
