/**
 * BranchList Page
 * Lists all branches with filtering, search, and pagination
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AppLayout,
  PageHeader,
  ErrorAlert,
  FilterForm,
  FormField,
  Label,
  Select,
  Card,
  Table,
  TablePagination,
  Button,
  Icon,
  Badge,
} from '@components';
import { useAuth } from '@contexts';
import type { Branch } from '@services/branches';
import { ROUTES } from '@common/constants';
import { useBranchList } from './useBranchList';

const BranchList: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, signOut } = useAuth();
  
  const {
    branches,
    loading,
    error,
    selectedCompany,
    setSelectedCompany,
    selectedStatus,
    setSelectedStatus,
    searchName,
    setSearchName,
    pagination,
    handleDelete,
    handlePageChange,
    handleSearch,
    handleClearSearch,
    setError,
  } = useBranchList();

  const columns = useMemo<ColumnDef<Branch>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nome',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'companyId',
        header: 'Empresa',
        cell: (info) => {
          const companyId = info.getValue() as string;
          return companyId || '-';
        },
      },
      {
        accessorKey: 'phone',
        header: 'Telefone',
        cell: (info) => {
          const phone = info.getValue() as string | undefined;
          return phone || '-';
        },
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
        accessorKey: 'createdAt',
        header: 'Data de Cadastro',
        cell: (info) => {
          const date = info.getValue() as string;
          return new Date(date).toLocaleDateString('pt-BR');
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
                  navigate(`${ROUTES.BRANCHES}/${branch.id}`);
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
                  navigate(`${ROUTES.BRANCHES}/${branch.id}/edit`);
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
                  handleDelete(branch.id, branch.name);
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
    [handleDelete, navigate]
  );

  return (
    <AppLayout user={currentUser} onSignOut={signOut}>
      <PageHeader
        title="Gerenciamento de Filiais"
        description="Gerencie filiais cadastradas no sistema"
        action={
          <Button onClick={() => navigate(ROUTES.BRANCHES_CREATE)}>
            <Icon icon={Plus} size={16} className="mr-2" />
            Nova Filial
          </Button>
        }
      />

      <ErrorAlert message={error || ''} onDismiss={() => setError(null)} dismissible />

      <FilterForm onSearch={handleSearch} onClear={handleClearSearch}>
        <FormField
          label="Buscar por Nome"
          placeholder="Nome da filial..."
          value={searchName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
        />
        <div>
          <Label className="mb-2 block">Filtrar por Empresa</Label>
          <Select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="all">Todas</option>
            {/* TODO: Carregar empresas dinamicamente */}
          </Select>
        </div>
        <div>
          <Label className="mb-2 block">Filtrar por Status</Label>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'active' | 'inactive')}
          >
            <option value="all">Todas</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
          </Select>
        </div>
      </FilterForm>

      <Card>
        <Table
          data={branches}
          columns={columns}
          loading={loading}
          onRowClick={(row) => navigate(`${ROUTES.BRANCHES}/${row.id}`)}
        />
        <TablePagination
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          totalPages={pagination.totalPages}
          total={pagination.total}
          onPageChange={handlePageChange}
          showPagination={pagination.totalPages > 1}
        />
      </Card>
    </AppLayout>
  );
};

export default BranchList;
