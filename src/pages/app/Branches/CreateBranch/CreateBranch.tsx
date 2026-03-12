/**
 * CreateBranch Page
 * Page for creating new branches
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { BranchForm } from '../components';
import { useCreateBranch } from './useCreateBranch';

const CreateBranch: React.FC = () => {
  const { user, signOut } = useAuth();
  const { form, isLoading, error, setError, onSubmit, handleCancel, handleAddressDataChange, companyIdFromState } = useCreateBranch();

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title="Nova Filial"
        description="Cadastre uma nova filial no sistema"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
              <Icon icon={Save} size={16} className="mr-2" />
              {isLoading ? 'Criando...' : 'Criar Filial'}
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error || ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <BranchForm mode="create" onAddressDataChange={handleAddressDataChange} companyIdDisabled={!!companyIdFromState} />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default CreateBranch;
