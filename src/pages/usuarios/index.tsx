import { UserIncidents } from "@/components/table-user-incidents";
import { DialogChangePassword } from "../../components/dialog-change-password";
import { api } from "@/utils/api";
import IncidentTableLoading from "@/components/skeletons/skeleton-table-incident";

export default function UserProfile() {
  const { data, isLoading, isError } = api.users.getIncidents.useQuery();
  return (
    <div className="flex items-start">
      <div className="flex-1">
        {isLoading || isError ? (
          <IncidentTableLoading />
        ) : (
          <UserIncidents data={data} />
        )}
      </div>
      <DialogChangePassword />
    </div>
  );
}
