import { BsFiletypePdf } from "react-icons/bs";
import { Button, buttonVariants } from "@/components/ui/button";
import { BlobProvider } from "@react-pdf/renderer";
import Link from "next/link";
import { ReactNode } from "react";

export const PDFLink = ({
  document,
  className,
  children,
}: {
  document: JSX.Element;
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <BlobProvider document={document}>
      {({ url, ...rest }) => {
        return (
          <Link
            href={url ?? ""}
            target="_blank"
            className={buttonVariants({
              variant: "outline",
              size: "icon",
              className,
            })}
          >
            {children} <BsFiletypePdf size={20} className="text-primary" />
          </Link>
        );
      }}
    </BlobProvider>
  );
};
