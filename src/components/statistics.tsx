import { type ReactNode } from "react";
import { TypographyH4 } from "@/components/typography/TypographyH4";
import { type HtmlHTMLAttributes } from "react";
import { Card } from "@/components/ui/card";
import { TypographySmall } from "@/components/typography/TypographySmall";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useDailyTimesQuery } from "@/hooks/useDailyTimesQuery";

export const DailyStatistics = ({
  className,
  ...props
}: HtmlHTMLAttributes<HTMLDivElement>) => {
  const { data, isLoading, isError } = useDailyTimesQuery();
  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(auto-fill,minmax(175px,1fr))] gap-2",
        className,
      )}
      {...props}
    >
      {isLoading || isError ? (
        <>
          {Array.from(Array(5)).map((_, i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </>
      ) : (
        <>
          <GridCard title="Total de ligações">{data.totalLigacoes}</GridCard>
          <GridCard title="Tempo Geral">{data.tempoGeral || 0} min</GridCard>
          <GridCard title="Tempo QTY-QUS">{data.QTYQUS || 0} min</GridCard>
          <GridCard title="Tempo QUS-QUY">{data.QUSQUY || 0} min</GridCard>
          <GridCard title="Tempo QUY-QUU">{data.QUYQUU || 0} min</GridCard>
        </>
      )}
    </div>
  );
};

type GridCardProps = {
  title: string;
  children: ReactNode;
};

const GridCard = ({ title, children }: GridCardProps) => {
  return (
    <Card className="flex flex-col justify-center px-4 py-1">
      <TypographySmall>{title}</TypographySmall>
      <TypographyH4 className="font-bold text-primary">{children}</TypographyH4>
    </Card>
  );
};
