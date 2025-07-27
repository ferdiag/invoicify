import { create } from "zustand";

export type User = {
  id: string;
  email: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  customers: Customer[];
};
export type InitCustomer = {
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
};
export type Customer = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
};
type UserState = {
  token: string | null;
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  setToken: (token: string) => void;
  deleteCustomer: (id: string) => void;
};

export const useUserStore = create<UserState>((set, get) => ({
  token: null,
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, token: null }),
  setToken: (token: string) => set({ token }),
  deleteCustomer: (id: string) => {
    const { user } = get();
    if (!user) return;
    const customersWithoutCustomer = user?.customers.filter((c) => c.id != id);
    set({ user: { ...user, customers: customersWithoutCustomer } });
  },
}));
