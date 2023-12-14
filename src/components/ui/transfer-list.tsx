import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { getStringScoreMatches } from "@/utils/getStringScoreMatch";
import { ReactNode, useState } from "react";
import { useTransferList } from "./transfer-list-provider";

type RenderParams = {
  option: Option;
  onTransfer: () => void;
};

type TransferListProps = {
  className?: string;
  withSearch?: boolean;
  render: (params: RenderParams) => ReactNode;
};

export function SourceList({
  className,
  withSearch,
  render,
}: TransferListProps) {
  const { sourceList, setDestinationList } = useTransferList();
  const [search, setSearch] = useState("");
  const filteredSourceList = sourceList.filter(
    (opt) => getStringScoreMatches(opt.label, search) > 0,
  );
  return (
    <Card className={cn("flex flex-grow flex-col gap-2 p-4", className)}>
      {withSearch && (
        <Input
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
        />
      )}
      <ScrollArea className="h-1 flex-grow">
        <div className="flex flex-col gap-2">
          {filteredSourceList.map((option) =>
            render({
              option,
              onTransfer: () => {
                setDestinationList((prev) => [...prev, option]);
              },
            }),
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}

export const DestinationList = ({
  className,
  render,
  withSearch,
}: TransferListProps) => {
  const { destinationList, setDestinationList } = useTransferList();
  const [search, setSearch] = useState("");
  const filteredSourceList = destinationList.filter(
    (opt) => getStringScoreMatches(opt.label, search) > 0,
  );
  return (
    <Card className={cn("flex flex-grow flex-col gap-2", className)}>
      {withSearch && (
        <Input
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
        />
      )}
      <ScrollArea className="h-1 flex-grow">
        <div className="flex flex-col gap-2 p-4">
          {filteredSourceList.map((option) =>
            render({
              option,
              onTransfer: () => {
                setDestinationList((prev) =>
                  prev.filter((o) => o.value !== option.value),
                );
              },
            }),
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
