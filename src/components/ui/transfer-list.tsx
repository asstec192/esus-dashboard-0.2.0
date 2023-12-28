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
  isSourceList?: boolean;
};

export function TransferList({
  className,
  withSearch,
  render,
  isSourceList,
}: TransferListProps) {
  const { sourceList, destinationList, setDestinationList } = useTransferList();
  const [search, setSearch] = useState("");
  const list = isSourceList ? sourceList : destinationList;

  const filteredList = list.filter(
    (opt) => getStringScoreMatches(opt.label, search) > 0,
  );

  return (
    <Card className={cn("flex flex-grow flex-col", className)}>
      {withSearch && (
        <div className="mt-4 px-4">
          <Input
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
          />
        </div>
      )}
      <ScrollArea className="h-1 flex-grow">
        <div className="flex flex-col gap-2 p-4">
          {filteredList.map((option) =>
            render({
              option,
              onTransfer: () => {
                if (isSourceList) {
                  setDestinationList((prev) => [...prev, option]);
                } else {
                  setDestinationList((prev) =>
                    prev.filter((o) => o.value !== option.value),
                  );
                }
              },
            }),
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
