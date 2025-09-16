import React, { useState } from 'react';
import DynamicForm from '../components/DynamicForm/DynamicForm';
import { useTranslation } from 'react-i18next';
import { createFormData } from '../factories/createForms';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import type { User } from '../store/types';
import { PATHS } from '../../../shared/paths';

const EditCompanyData: React.FC = () => {
  const { user, handleApiError, editCompanyDataSuccess } = useUserStore();
  const [editedUser, seteditedUser] = useState<Partial<User>>(user!);
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!user) {
    return <div>{t('addCompanyData.noUser')}</div>;
  }
  const keys: (keyof User)[] = [
    'name',
    'email',
    'phone',
    'contact',
    'address',
    'zip',
    'city',
    'country',
    'taxNumber',
  ];

  const formData = createFormData(editedUser as Record<string, unknown>, t, keys);

  const handleUpdateCompanyData = async () => {
    const response = await api.patch(PATHS.USERS.buildById(user.id), editedUser);
    if ([200, 201].includes(response.status)) {
      editCompanyDataSuccess(editedUser, navigate, t);
    } else {
      handleApiError(response, t);
    }
  };
  return (
    <DynamicForm
      title={t('addCompanyData.title')}
      fields={formData}
      setState={seteditedUser}
      onSubmit={() => void handleUpdateCompanyData}
      submitLabel={t('buttons.save')}
    />
  );
};

export default EditCompanyData;
