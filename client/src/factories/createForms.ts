import type { TFunction } from "i18next";

type FormField = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
};

export const createFormData = <T extends Record<string, unknown>>(
  target: Partial<T>,
  t: TFunction<"translation", undefined>,
  keys: (keyof T)[]
): FormField[] => {
  return keys.map((key) => ({
    id: key as string,
    label: t(`commonLabels.${String(key)}`),
    placeholder: t(`commonLabels.${String(key)}`),
    value: typeof target[key] === "string" ? (target[key] as string) : "",
  }));
};
