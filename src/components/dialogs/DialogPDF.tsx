import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { ReactNode } from "react";
import { BsFiletypePdf } from "react-icons/bs";
import { Button } from "../ui/button";

export const DialogPDFViwer = ({ children }: { children: ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <BsFiletypePdf size={25} className="text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl">{children}</DialogContent>
    </Dialog>
  );
};
