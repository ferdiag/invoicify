import { create } from "zustand";
import { actions } from "./actions";
import type { User, UserState } from "./types";

export const baseStore = (
  set: (partial: Partial<UserState>) => void,
  get: () => UserState
) => ({
  token: null,
  user: null,
  setUser: (user: User) => set({ user }),
  logout: () => set({ user: null, token: null }),
  setToken: (token: string) => set({ token }),
  ...actions(set, get),
});
export const useUserStore = create<UserState>(baseStore as () => UserState);
