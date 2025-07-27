import type { TFunction } from "i18next";
import type { InitCustomer } from "../store/userStore";

export const createFormData = (
  customer: Partial<InitCustomer>,
  t: TFunction<"translation", undefined>
) => {
  return [
    {
      id: "contact",
      label: t("commonLabels.contact"),
      placeholder: t("commonLabels.contact"),
      value: customer.contact ?? "",
    },
    {
      id: "name",
      label: t("commonLabels.name"),
      placeholder: t("commonLabels.name"),
      value: customer.name ?? "",
    },
    {
      id: "email",
      label: t("commonLabels.email"),
      placeholder: t("commonLabels.email"),
      value: customer.email ?? "",
    },
    {
      id: "phone",
      label: t("commonLabels.phone"),
      placeholder: t("commonLabels.phone"),
      value: customer.phone ?? "",
    },
    {
      id: "address",
      label: t("commonLabels.address"),
      placeholder: t("commonLabels.address"),
      value: customer.address ?? "",
    },
    {
      id: "city",
      label: t("commonLabels.city"),
      placeholder: t("commonLabels.city"),
      value: customer.city ?? "",
    },
    {
      id: "zip",
      label: t("commonLabels.zip"),
      placeholder: t("commonLabels.zip"),
      value: customer.zip ?? "",
    },
    {
      id: "country",
      label: t("commonLabels.country"),
      placeholder: t("commonLabels.country"),
      value: customer.country ?? "",
    },
  ];
};
