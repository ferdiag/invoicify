export const LIMITS = {
  email: 255,
  phone: 50,
  address: 255,
  city: 100,
  zip: 20,
  country: 100,
  taxNumber: 15,
  passwordMin: 8,
  passwordMax: 72,
};

export const MSG = {
  tooLong: (label: string, max: number) => `${label} ist zu lang (max. ${max} Zeichen).`,
};
