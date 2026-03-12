/**
 * CompanyDetails Page
 * Page for viewing company details and its branches
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Edit, Trash2, CheckCircle, XCircle, Plus, Eye } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AppLayout,
  PageHeader,
  ErrorAlert,
  Button,
  Icon,
  Card,
  Table,
  Badge,
} from '@components';
import { useAuth } from '@contexts';
import { CompanyForm } from '../components';
import { useCompanyDetails } from './useCompanyDetails';
import type { Branch } from '@services/branches';
import { ROUTES } from '@common/constants';

const CompanyDetails: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, signOut } = useAuth();
  const {
    company,
    branches,
    branchesLoading,
    loading,
    error,
    setError,
    toggling,
    form,
    handleToggleActive,
    handleDelete,
    handleDeleteBranch,
    handleEdit,
    handleBack,
  } = useCompanyDetails();

  const branchColumns = useMemo<ColumnDef<Branch>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nome',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'phone',
        header: 'Telefone',
        cell: (info) => (info.getValue() as string) || '-',
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: (info) => {
          const isActive = info.getValue() as boolean;
          return (
            <Badge variant={isActive ? 'success' : 'error'}>
              {isActive ? 'Ativa' : 'Inativa'}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-center">Ações</div>,
        cell: (info) => {
          const branch = info.row.original;
          return (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(ROUTES.BRANCHES_DETAILS.replace(':id', branch.id));
                }}
                title="Ver detalhes"
              >
                <Icon icon={Eye} size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(ROUTES.BRANCHES_EDIT.replace(':id', branch.id));
                }}
                title="Editar filial"
              >
                <Icon icon={Edit} size={16} />
              </Button>
              <Button
                variant="error"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBranch(branch.id, branch.name);
                }}
                title="Excluir filial"
              >
                <Icon icon={Trash2} size={16} />
              </Button>
            </div>
          );
        },
      },
    ],
    [navigate, handleDeleteBranch]
  );

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
            <CompanyForm mode="view" isViewOnly company={company} />
          </form>
        </FormProvider>
      </Card>

      <Card className="p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filiais</h2>
          <Button
            onClick={() =>
              navigate(ROUTES.BRANCHES_CREATE, {
                state: { companyId: company.id, returnToCompany: true },
              })
            }
          >
            <Icon icon={Plus} size={16} className="mr-2" />
            Nova filial
          </Button>
        </div>
        <Table
          data={branches}
          columns={branchColumns}
          loading={branchesLoading}
          onRowClick={(row) => navigate(ROUTES.BRANCHES_DETAILS.replace(':id', row.id))}
        />
        {!branchesLoading && branches.length === 0 && (
          <p className="text-muted-foreground py-4 text-center">
            Nenhuma filial cadastrada. Clique em &quot;Nova filial&quot; para cadastrar.
          </p>
        )}
      </Card>
    </AppLayout>
  );
};

export default CompanyDetails;
