/**
 * EditCompany Page
 * Page for editing company details
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { CompanyForm } from '../components';
import { useEditCompany } from './useEditCompany';

const EditCompany: React.FC = () => {
  const { user: currentUser, signOut } = useAuth();
  const { company, loading, saving, error, setError, form, onSubmit, handleCancel, handleAddressChange, handleAddressDataChange } = useEditCompany();

  if (loading) {
    return (
      <AppLayout user={currentUser} onSignOut={signOut}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600 dark:text-gray-400">Carregando dados da empresa...</div>
        </div>
      </AppLayout>
    );
  }

  if (!company) {
    return (
      <AppLayout user={currentUser} onSignOut={signOut}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <ErrorAlert message="Empresa não encontrada para edição." dismissible={false} />
            <Button onClick={handleCancel} className="mt-4">
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={currentUser} onSignOut={signOut}>
      <PageHeader
        title={`Editar Empresa: ${company.name}`}
        description="Atualize as informações da empresa"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={saving}>
              <Icon icon={Save} size={16} className="mr-2" />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error || ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CompanyForm 
              mode="edit" 
              company={company} 
              onAddressChange={handleAddressChange}
              onAddressDataChange={handleAddressDataChange}
            />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default EditCompany;
