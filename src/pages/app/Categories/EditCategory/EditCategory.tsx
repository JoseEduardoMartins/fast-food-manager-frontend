/**
 * EditCategory Page
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { CategoryForm } from '../components';
import { useEditCategory } from './useEditCategory';
import type { CategoryEditFormData } from '../schemas';

const EditCategory: React.FC = () => {
  const { user, signOut } = useAuth();
  const {
    category,
    loading,
    saving,
    error,
    setError,
    form,
    onSubmit,
    handleCancel,
  } = useEditCategory();

  if (loading) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Carregando..." />
        <Card className="p-6">Carregando categoria...</Card>
      </AppLayout>
    );
  }

  if (!category) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Categoria não encontrada" />
        <Card className="p-6">
          <Button onClick={handleCancel}>
            <Icon icon={ArrowLeft} size={16} className="mr-2" />
            Voltar
          </Button>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title={`Editar categoria: ${category.name}`}
        description="Atualize os dados da categoria"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button onClick={form.handleSubmit(onSubmit as (data: CategoryEditFormData) => void)} disabled={saving}>
              <Icon icon={Save} size={16} className="mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as (data: CategoryEditFormData) => void)}>
            <CategoryForm mode="edit" category={category} />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default EditCategory;
