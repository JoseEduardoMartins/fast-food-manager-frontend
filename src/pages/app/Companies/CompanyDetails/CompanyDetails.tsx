/**
 * CompanyDetails Page
 * Page for viewing company details
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { CompanyForm } from '../components';
import { useCompanyDetails } from './useCompanyDetails';

const CompanyDetails: React.FC = () => {
  const { user: currentUser, signOut } = useAuth();
  const {
    company,
    loading,
    error,
    setError,
    toggling,
    form,
    handleToggleActive,
    handleDelete,
    handleEdit,
    handleBack,
    reloadCompany,
  } = useCompanyDetails();

  if (loading) {
    return (
      <AppLayout user={currentUser} onSignOut={signOut}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600 dark:text-gray-400">Carregando detalhes da empresa...</div>
        </div>
      </AppLayout>
    );
  }

  if (!company) {
    return (
      <AppLayout user={currentUser} onSignOut={signOut}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <ErrorAlert message="Empresa não encontrada." dismissible={false} />
            <Button onClick={handleBack} className="mt-4">
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar para a lista
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={currentUser} onSignOut={signOut}>
      <PageHeader
        title={`Detalhes da Empresa: ${company.name}`}
        description="Visualize as informações completas da empresa"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button onClick={handleEdit}>
              <Icon icon={Edit} size={16} className="mr-2" />
              Editar
            </Button>
            <Button
              variant={company.isActive ? 'warning' : 'success'}
              onClick={handleToggleActive}
              disabled={toggling}
            >
              <Icon icon={company.isActive ? XCircle : CheckCircle} size={16} className="mr-2" />
              {toggling ? 'Alterando...' : company.isActive ? 'Desativar' : 'Ativar'}
            </Button>
            <Button
              variant="error"
              onClick={handleDelete}
            >
              <Icon icon={Trash2} size={16} className="mr-2" />
              Excluir
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error || ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-6">
        <FormProvider {...form}>
          <form>
            <CompanyForm mode="view" isViewOnly company={company} onAddressChange={reloadCompany} />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default CompanyDetails;
