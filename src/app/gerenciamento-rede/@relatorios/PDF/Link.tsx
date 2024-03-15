"use client";

import { useRenderPDF } from "./useRenderPDF";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BsFiletypePdf } from "react-icons/bs";
import { Loader2 } from "lucide-react";
import { api } from "@/trpc/react";
import { useGerenciamentoRedeRelatorioStore } from "../../stores";
import { toast } from "@/components/ui/use-toast";

export const PDFRelatorioRede = () => {
  const date = useGerenciamentoRedeRelatorioStore((state) => state.date);
  const { data: pdfData, isLoading: isLoadingData } =
    api.hospitalManager.obterRelatoriosAgrupadosPorHospitais.useQuery(date, {
      staleTime: Infinity,
    });

  const {
    url,
    loading: isLoadingBuffer,
    error,
  } = useRenderPDF({ date, pdfData });

  const isLoading = isLoadingBuffer || isLoadingData;

  if (isLoading)
    return (
      <Button variant="outline" disabled={true}>
        <Loader2 className="animate-spin" />
      </Button>
    );

  if (error) {
    toast({
      description: JSON.stringify(error),
      variant: "destructive",
    });
    return null;
  }

  return (
    <Button asChild variant="outline">
      <Link href={url ?? ""} target={"_blank"}>
        <BsFiletypePdf size={20} className="text-primary" />
      </Link>
    </Button>
  );
};
