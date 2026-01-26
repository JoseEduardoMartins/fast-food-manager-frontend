/**
 * CreateCompany Page
 * Page for creating new companies
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { CompanyForm } from '../components';
import { useCreateCompany } from './useCreateCompany';

const CreateCompany: React.FC = () => {
  const { user, signOut } = useAuth();
  const { form, isLoading, error, setError, onSubmit, handleCancel, handleAddressChange, handleAddressDataChange } = useCreateCompany();

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title="Nova Empresa"
        description="Cadastre uma nova empresa no sistema"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
              <Icon icon={Save} size={16} className="mr-2" />
              {isLoading ? 'Criando...' : 'Criar Empresa'}
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error || ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CompanyForm mode="create" onAddressChange={handleAddressChange} onAddressDataChange={handleAddressDataChange} />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default CreateCompany;
