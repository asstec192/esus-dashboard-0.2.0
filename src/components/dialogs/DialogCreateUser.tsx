import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignUpForm } from "../form-signup";

export const DialogCreateUser = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Cadastrar Usuário</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Cadastro de usuário</DialogTitle>
        <SignUpForm />
      </DialogContent>
    </Dialog>
  );
};
