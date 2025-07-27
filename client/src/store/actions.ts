import { toast } from "react-toastify";
import type { UserState } from "./types";
import axios from "axios";

export const actions = (
  set: (partial: Partial<UserState>) => void,
  get: () => UserState
): Partial<UserState> => ({
  deleteCustomer: (id) => {
    const { user } = get();
    if (!user) return;
    const customersWithoutCustomer = user?.customers.filter((c) => c.id != id);
    set({ user: { ...user, customers: customersWithoutCustomer } });
  },
  loginSuccess: (data, message, navigate) => {
    toast.success(message, { position: "bottom-center" });
    set({ user: data.user, token: data.token });
    navigate("/dashboard");
  },
  registerSuccess: (reset, message, setMode) => {
    reset();
    toast.success(message);
    setMode("login");
  },
  handleApiError: (error, t) => {
    let message;
    if (axios.isAxiosError(error)) {
      const potentialMessage = error?.response?.data?.message
        ? t(`${error.response.data.message}`, error.response.data)
        : error?.message;
      message =
        typeof potentialMessage === "string"
          ? potentialMessage
          : t(`auth.defaultError`);
    }

    toast.error(String(message), { position: "bottom-center" });
  },
  editCompanyDataSuccess: (updatedUser, navigate, t) => {
    const { user } = get();
    if (!user) return null;
    set({ user: { ...user, ...updatedUser } });

    navigate("/dashboard");
    toast.success(t("addCompanyData.Success"));
  },
});
