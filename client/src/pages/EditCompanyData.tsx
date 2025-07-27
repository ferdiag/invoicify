import React, { useState } from "react";
import DynamicForm from "../components/DynamicForm";
import { useTranslation } from "react-i18next";
import { createFormData } from "../factories/createForms";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import type { User } from "../store/types";

const EditCompanyData: React.FC = () => {
  const { user, handleApiError, editCompanyDataSuccess } = useUserStore();
  const [editedUser, seteditedUser] = useState<Partial<User>>(user!);
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!user) {
    return <div>{t("addCompanyData.noUser")}</div>;
  }
  const keys: (keyof User)[] = [
    "name",
    "email",
    "phone",
    "contact",
    "address",
    "zip",
    "city",
    "country",
  ];

  const formData = createFormData<User>(editedUser, t, keys);

  const handleUpdateCompanyData = async () => {
    if (editedUser) {
      const response = await api.patch(`/api/user/${user!.id}`, editedUser);
      console.log("Response from API:", response);
      if ([200, 201].includes(response.status)) {
        editCompanyDataSuccess(editedUser, navigate, t);
      } else {
        handleApiError(response, t);
      }
    }
  };
  return (
    <DynamicForm
      title={t("addCompanyData.title")}
      fields={formData}
      setState={seteditedUser}
      onSubmit={handleUpdateCompanyData}
      submitLabel={t("buttons.save")}
    />
  );
};

export default EditCompanyData;
