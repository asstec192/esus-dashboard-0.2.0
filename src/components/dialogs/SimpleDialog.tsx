import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";

type SimpleDialogProps = {
  children?: ReactNode;
  title?: string;
  trigger?: ReactElement;
  open?: boolean;
  onOpenChange?: () => void;
} & HTMLAttributes<HTMLDivElement>;

export const SimpleDialog = ({
  title,
  trigger,
  children,
  open,
  onOpenChange,
  ...props
}: SimpleDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent {...props} className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
