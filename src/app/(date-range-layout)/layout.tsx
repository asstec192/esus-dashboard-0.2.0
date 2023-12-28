import { GlobalDatePicker } from "@/components/date-pickers/GlobalDatePicker";
import { ReactNode } from "react";

export default function DateRangeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-grow flex-col">
      <GlobalDatePicker />
      {children}
    </div>
  );
}
