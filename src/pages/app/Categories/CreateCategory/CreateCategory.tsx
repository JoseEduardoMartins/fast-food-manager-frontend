/**
 * CreateCategory Page
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { CategoryForm } from '../components';
import { useCreateCategory } from './useCreateCategory';
import type { CreateCategoryFormData } from '../schemas';

const CreateCategory: React.FC = () => {
  const { user, signOut } = useAuth();
  const { form, isLoading, error, setError, onSubmit, handleCancel } = useCreateCategory();

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title="Nova categoria"
        description="Cadastre uma nova categoria de menu"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button onClick={form.handleSubmit(onSubmit as (data: CreateCategoryFormData) => void)} disabled={isLoading}>
              <Icon icon={Save} size={16} className="mr-2" />
              {isLoading ? 'Criando...' : 'Criar categoria'}
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as (data: CreateCategoryFormData) => void)}>
            <CategoryForm mode="create" />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default CreateCategory;
