import type { TFunction } from "i18next";
import type { NavigateFunction } from "react-router-dom";

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
export type UserState = {
  token: string | null;
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  setToken: (token: string) => void;
  deleteCustomer: (id: string) => void;
  loginSuccess: (
    data: { user: User; token: string },
    message: string,
    navigate: NavigateFunction
  ) => void;
  registerSuccess: (
    reset: () => void,
    message: string,
    setMode: React.Dispatch<React.SetStateAction<"login" | "register">>
  ) => void;
  handleApiError: (
    error: unknown,
    t: TFunction<"translation", undefined>
  ) => void;
  editCompanyDataSuccess: (
    newUser: Partial<User>,
    navigate: NavigateFunction,
    t: TFunction<"translation", undefined>
  ) => void;
};
