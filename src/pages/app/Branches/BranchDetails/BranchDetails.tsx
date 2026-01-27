/**
 * BranchDetails Page
 * Page for viewing branch details
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Edit, Trash2, Power } from 'lucide-react';
import {
  AppLayout,
  PageHeader,
  ErrorAlert,
  Button,
  Icon,
  Card,
} from '@components';
import { useAuth } from '@contexts';
import { BranchForm } from '../components';
import { useBranchDetails } from './useBranchDetails';

const BranchDetails: React.FC = () => {
  const { user, signOut } = useAuth();
  const {
    branch,
    loading,
    error,
    setError,
    toggling,
    form,
    handleToggleActive,
    handleDelete,
    handleEdit,
    handleBack,
  } = useBranchDetails();

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
          <Button onClick={handleBack} className="mt-4">
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
        title={branch.name}
        description="Detalhes da filial"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Icon icon={Edit} size={16} className="mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={handleToggleActive}
              disabled={toggling}
            >
              <Icon icon={Power} size={16} className="mr-2" />
              {branch.isActive ? 'Desativar' : 'Ativar'}
            </Button>
            <Button variant="error" onClick={handleDelete}>
              <Icon icon={Trash2} size={16} className="mr-2" />
              Excluir
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error || ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-6">
        <FormProvider {...form}>
          <BranchForm mode="view" isViewOnly branch={branch} />
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default BranchDetails;
