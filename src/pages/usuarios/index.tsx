import { api } from "@/utils/api";
import TableIncidentsLoading from "@/components/skeletons/skeleton-table-incident";
import { TableUserIncidents } from "@/components/tables/TableUserIncidents";
import { DialogPasswordChange } from "@/components/dialogs/DialogPasswordChange";

export default function UserProfile() {
  const { data, isLoading, isError } = api.users.getIncidents.useQuery();
  return (
    <div className="flex items-start">
      <div className="flex-1">
        {isLoading || isError ? (
          <TableIncidentsLoading />
        ) : (
          <TableUserIncidents data={data} />
        )}
      </div>
      <DialogPasswordChange />
    </div>
  );
}
