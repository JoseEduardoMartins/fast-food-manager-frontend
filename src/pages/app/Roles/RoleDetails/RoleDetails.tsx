/**
 * RoleDetails Page
 */

import React from 'react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card, Label } from '@components';
import { useAuth } from '@contexts';
import { PERMISSIONS, PERMISSIONS_BY_RESOURCE } from '@common/constants/permissions';
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

  const permissionsList = new Set(role.permissions ?? []);
  const RESOURCE_LABELS: Record<string, string> = {
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
          <h3 className="text-lg font-semibold mb-3">
            Permissões ({permissionsList.size})
          </h3>
          {permissionsList.size === 0 && (
            <p className="text-gray-500">Nenhuma permissão atribuída.</p>
          )}
          {permissionsList.size > 0 && (
            <div className="space-y-6">
              {Object.entries(PERMISSIONS_BY_RESOURCE).map(([resource, codes]) => (
                <div key={resource}>
                  <Label className="block font-medium mb-2">
                    {RESOURCE_LABELS[resource] ?? resource}
                  </Label>
                  <div className="flex flex-wrap gap-3">
                    {codes.map((code) => {
                      const granted = permissionsList.has(code);
                      const [, action] = code.split('.');
                      return (
                        <label key={code} className="flex items-center gap-2 cursor-default">
                          <input
                            type="checkbox"
                            checked={granted}
                            disabled
                            className="h-4 w-4"
                          />
                          <span className="text-sm">{action}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </AppLayout>
  );
};

export default RoleDetails;
