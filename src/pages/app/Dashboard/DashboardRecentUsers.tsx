/**
 * DashboardRecentUsers
 * Exibe os últimos usuários cadastrados (requer users.list)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Card,
  Title,
  Label,
  Button,
  Table,
  Badge,
  Icon,
} from '@components';
import type { User } from '@services/users';
import { ROUTES } from '@common/constants';
import { useDashboardRecentUsers } from './useDashboardRecentUsers';
import { ChevronRight } from 'lucide-react';

function getRoleLabel(role: User['role']): string {
  if (typeof role === 'object' && role?.name) return role.name;
  if (typeof role === 'string') return role;
  return '-';
}

export const DashboardRecentUsers: React.FC = () => {
  const navigate = useNavigate();
  const { users, loading, error } = useDashboardRecentUsers();

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: (info) => (
        <span className="font-medium">{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'email',
      header: 'E-mail',
      cell: (info) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Perfil',
      cell: (info) => getRoleLabel(info.getValue() as User['role']),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: (info) => {
        const active = info.getValue() as boolean;
        return (
          <Badge variant={active ? 'success' : 'default'}>
            {active ? 'Ativo' : 'Inativo'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Cadastrado em',
      cell: (info) =>
        new Date(info.getValue() as string).toLocaleString('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
        }),
    },
  ];

  if (error) {
    return (
      <Card className="p-4 border-error bg-error/5">
        <Label className="text-error">{error}</Label>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Title variant="h3" className="font-semibold">
          Últimos Usuários
        </Title>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.USERS)}
          className="gap-1"
        >
          Ver todos
          <Icon icon={ChevronRight} size={16} />
        </Button>
      </div>
      <Table
        data={users}
        columns={columns}
        loading={loading}
        onRowClick={(row) => navigate(`${ROUTES.USERS}/${row.id}`)}
      />
    </Card>
  );
};
