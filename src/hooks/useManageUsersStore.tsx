import { DashboardUser } from "@/types/DashboardUser";
import { create } from "zustand";

type ManageUsersStore = {
  selectedUser?: DashboardUser;
  setSelectedUser: (user?: DashboardUser) => void;
};

export const useManageUsersStore = create<ManageUsersStore>()((set) => ({
  setSelectedUser: (user) => set(() => ({ selectedUser: user })),
}));
