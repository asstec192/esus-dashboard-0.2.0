import { ReactNode } from "react";
import { DateFilterBar } from "./date-filter-bar";
import { TypographyH3 } from "../typography/TypographyH3";
import { Button } from "../ui/button";
import { Lightbulb } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function AnalyticsLayout({
  children,
  pageTitle,
}: {
  children: ReactNode;
  pageTitle: string;
}) {
  return (
    <div className="relative flex h-[calc(100vh-var(--nav))] flex-col">
      <div className="mb-4 flex flex-wrap gap-2">
        <TypographyH3 className="">{pageTitle}</TypographyH3>
        <Popover>
          <PopoverTrigger asChild className="ml-auto">
            <Button variant="ghost" size="icon">
              <Lightbulb size="1rem" className="text-primary" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-primary text-primary-foreground">
            <p>
              A base de dados possui resultados a partir de Nov/2022. Evite
              intervalos muito longos para uma busca mais rápida. Recomenda-se o
              máximo de um mês.
            </p>
          </PopoverContent>
        </Popover>
        <DateFilterBar />
      </div>
      {children}
    </div>
  );
}
