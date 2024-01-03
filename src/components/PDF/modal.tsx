import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { BsFiletypePdf } from "react-icons/bs";
import { ReactElement } from "react";
import { PDFViewer } from "@react-pdf/renderer";

export const PDFModal = ({ children }: { children: ReactElement }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="icon">
          <BsFiletypePdf size={20} className="text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <PDFViewer className="mt-4 h-[70vh] w-full">{children}</PDFViewer>
      </DialogContent>
    </Dialog>
  );
};
