import type { ReactNode } from "react";
import { endOfDay, startOfDay } from "date-fns";
import { Info } from "lucide-react";

import { GlobalDatePicker } from "@/components/date-pickers/global-date-picker";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServerAuthSession } from "@/server/auth";
import { UserRole } from "@/types/UserRole";

export default async function DashboardLayout(props: {
  crufor: ReactNode;
  samu: ReactNode;
  rue: ReactNode;
}) {
  const periodo = {
    start: startOfDay(new Date()),
    end: endOfDay(new Date()),
  };

  const session = await getServerAuthSession();
  const isAdmin = session?.user.role === UserRole.admin;

  return (
    <Tabs defaultValue="crufor">
      <div className="flex justify-between gap-2">
        <TabsList>
          <TabsTrigger value="crufor">CRUFor</TabsTrigger>
          <TabsTrigger value="samu">SAMU</TabsTrigger>
          <TabsTrigger value="rue">RUE</TabsTrigger>
        </TabsList>

        {isAdmin ? (
          <GlobalDatePicker />
        ) : (
          <>
            <Popover>
              <PopoverTrigger>
                <Info className="mr-6 flex text-primary sm:hidden" />
              </PopoverTrigger>
              <PopoverContent className="p-2">
                Dados referentes ao dia {periodo.start.toLocaleDateString()} de{" "}
                {periodo.start.toLocaleTimeString()} às{" "}
                {periodo.end.toLocaleTimeString()}
              </PopoverContent>
            </Popover>
            <Badge
              className="ml-auto h-10 flex-1 rounded sm:flex-none"
              variant="secondary"
            >
              Dados referentes ao dia {periodo.start.toLocaleDateString()} de{" "}
              {periodo.start.toLocaleTimeString()} às{" "}
              {periodo.end.toLocaleTimeString()}
            </Badge>
          </>
        )}
      </div>

      <TabsContent value="crufor">{props.crufor}</TabsContent>
      <TabsContent value="samu">{props.samu}</TabsContent>
      <TabsContent value="rue">{props.rue}</TabsContent>
    </Tabs>
  );
}
