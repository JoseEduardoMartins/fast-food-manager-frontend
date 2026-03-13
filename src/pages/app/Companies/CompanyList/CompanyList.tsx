/**
 * CompanyList Page
 * Lists all companies with filtering, search, and pagination
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AppLayout,
  PageHeader,
  ErrorAlert,
  FilterBar,
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
import type { Company } from '@services/companies';
import { ROUTES } from '@common/constants';
import { useCompanyList } from './useCompanyList';

const CompanyList: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, signOut } = useAuth();
  
  const {
    companies,
    loading,
    error,
    selectedStatus,
    setSelectedStatus,
    searchName,
    setSearchName,
    searchCnpj,
    setSearchCnpj,
    pagination,
    handleDelete,
    handlePageChange,
    handleSearch,
    handleClearSearch,
    setError,
  } = useCompanyList();

  const columns = useMemo<ColumnDef<Company>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nome',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'cnpj',
        header: 'CNPJ',
        cell: (info) => info.getValue(),
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
        meta: { align: 'center' as const },
        header: 'Ações',
        cell: (info) => {
          const company = info.row.original;
          return (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`${ROUTES.COMPANIES}/${company.id}`);
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
                  navigate(`${ROUTES.COMPANIES}/${company.id}/edit`);
                }}
                title="Editar empresa"
              >
                <Icon icon={Edit} size={16} />
              </Button>
              <Button
                variant="error"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(company.id, company.name);
                }}
                title="Excluir empresa"
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
        title="Gerenciamento de Empresas"
        description="Gerencie empresas cadastradas no sistema"
        action={
          <Button onClick={() => navigate(ROUTES.COMPANIES_CREATE)}>
            <Icon icon={Plus} size={16} className="mr-2" />
            Nova Empresa
          </Button>
        }
      />

      <ErrorAlert message={error || ''} onDismiss={() => setError(null)} dismissible />

      <FilterBar
        searchSlot={
          <FormField
            label="Buscar por Nome"
            placeholder="Nome da empresa..."
            value={searchName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
          />
        }
        filterContent={
          <>
            <FormField
              label="Buscar por CNPJ"
              placeholder="CNPJ..."
              value={searchCnpj}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchCnpj(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
            />
            <div>
              <Label className="mb-2 block">Status</Label>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'active' | 'inactive')}
              >
                <option value="all">Todas</option>
                <option value="active">Ativas</option>
                <option value="inactive">Inativas</option>
              </Select>
            </div>
          </>
        }
        onFilter={handleSearch}
        onClear={handleClearSearch}
        filterTitle="Filtros"
      />

      <Card>
        <Table
          data={companies}
          columns={columns}
          loading={loading}
          onRowClick={(row) => navigate(`${ROUTES.COMPANIES}/${row.id}`)}
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

export default CompanyList;
