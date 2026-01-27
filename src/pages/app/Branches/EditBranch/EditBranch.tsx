/**
 * EditBranch Page
 * Page for editing existing branches
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { BranchForm } from '../components';
import { useEditBranch } from './useEditBranch';

const EditBranch: React.FC = () => {
  const { user, signOut } = useAuth();
  const { branch, loading, saving, error, setError, form, onSubmit, handleCancel, handleAddressDataChange } = useEditBranch();

  if (loading) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Carregando..." />
        <Card className="p-6">
          <p>Carregando dados da filial...</p>
        </Card>
      </AppLayout>
    );
  }

  if (!branch) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Filial não encontrada" />
        <Card className="p-6">
          <p>Filial não encontrada.</p>
          <Button onClick={handleCancel} className="mt-4">
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
        title={`Editar Filial: ${branch.name}`}
        description="Atualize os dados da filial"
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
            <BranchForm mode="edit" branch={branch} onAddressDataChange={handleAddressDataChange} />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default EditBranch;
