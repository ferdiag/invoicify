export const PATHS = {
  AUTH: {
    REGISTER: "/register",
    LOGIN: "/login",
  },
  CUSTOMERS: {
    ROOT: "/customers",
    BY_ID: `/customers/id`,
    buildById: (id: string) => `/customers/${id}`,
  },
  USERS: {
    ROOT: "/users",
    BY_ID: `/users/id`,
    buildById: (id: string) => `/users/${id}`,
  },
  INVOICES: {
    ROOT: "/invoices",
  },
} as const;
export const API_PREFIX = "/api";
