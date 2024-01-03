import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminFormCadastroUsuario } from "./form-cadastro-usuario";

export const AdminDialogCreateUser = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Cadastrar Usuário</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Cadastro de usuário</DialogTitle>
        <AdminFormCadastroUsuario />
      </DialogContent>
    </Dialog>
  );
};
