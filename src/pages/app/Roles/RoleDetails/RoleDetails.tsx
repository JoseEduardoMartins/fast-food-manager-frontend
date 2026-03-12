/**
 * RoleDetails Page
 */

import React from 'react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { PERMISSIONS } from '@common/constants/permissions';
import { useRoleDetails } from './useRoleDetails';

const RoleDetails: React.FC = () => {
  const { user: currentUser, signOut, hasPermission } = useAuth();
  const { role, loading, error, setError, handleDelete, handleEdit, handleBack } = useRoleDetails();

  const canUpdate = hasPermission(PERMISSIONS.roles.update);
  const canDelete = hasPermission(PERMISSIONS.roles.delete);

  if (loading) {
    return (
      <AppLayout user={currentUser} onSignOut={signOut}>
        <div className="flex items-center justify-center min-h-[400px]">Carregando...</div>
      </AppLayout>
    );
  }

  if (!role) {
    return null;
  }

  const permissionsList = role.permissions ?? [];
  const resourceLabels: Record<string, string> = {
    users: 'Usuários',
    companies: 'Empresas',
    branches: 'Filiais',
    menus: 'Menus',
    categories: 'Categorias',
    products: 'Produtos',
    orders: 'Pedidos',
    ingredients: 'Ingredientes',
    roles: 'Perfis de Acesso',
  };

  return (
    <AppLayout user={currentUser} onSignOut={signOut}>
      <PageHeader
        title={`Perfil: ${role.name}`}
        description="Detalhes e permissões do perfil de acesso"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            {canUpdate && !role.isSystem && (
              <Button onClick={handleEdit}>
                <Icon icon={Edit} size={16} className="mr-2" />
                Editar
              </Button>
            )}
            {canDelete && !role.isSystem && (
              <Button variant="error" onClick={handleDelete}>
                <Icon icon={Trash2} size={16} className="mr-2" />
                Excluir
              </Button>
            )}
          </div>
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-6">
        <div className="mb-6">
          <span className="text-gray-600 dark:text-gray-400 mr-2">Tipo:</span>
          <span className="font-medium">{role.isSystem ? 'Sistema' : 'Customizado'}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Permissões ({permissionsList.length})</h3>
          <ul className="flex flex-wrap gap-2">
            {permissionsList.map((code) => {
              const [resource, action] = code.split('.');
              const label = resource ? `${resourceLabels[resource] ?? resource}.${action}` : code;
              return (
                <li key={code}>
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-sm">
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
          {permissionsList.length === 0 && (
            <p className="text-gray-500">Nenhuma permissão atribuída.</p>
          )}
        </div>
      </Card>
    </AppLayout>
  );
};

export default RoleDetails;
