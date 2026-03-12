/**
 * EditRole Page
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card, FormField, Label } from '@components';
import { useAuth } from '@contexts';
import { PERMISSIONS_BY_RESOURCE } from '@common/constants/permissions';
import { useEditRole } from './useEditRole';

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

const EditRole: React.FC = () => {
  const { user: currentUser, signOut } = useAuth();
  const { role, loading, saving, error, setError, onSubmit, onCancel } = useEditRole();
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (role) {
      setName(role.name);
      setSelectedPermissions(new Set(role.permissions ?? []));
    }
  }, [role]);

  const togglePermission = (code: string) => {
    if (role?.isSystem) return;
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role) return;
    onSubmit({ name: name.trim(), permissions: Array.from(selectedPermissions) });
  };

  if (loading || !role) {
    return (
      <AppLayout user={currentUser} onSignOut={signOut}>
        <div className="flex items-center justify-center min-h-[400px]">Carregando...</div>
      </AppLayout>
    );
  }

  if (role.isSystem) {
    return (
      <AppLayout user={currentUser} onSignOut={signOut}>
        <div className="p-6">
          <p className="text-gray-600">Perfis do sistema não podem ser editados.</p>
          <Button variant="outline" onClick={onCancel} className="mt-4">
            Voltar
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={currentUser} onSignOut={signOut}>
      <PageHeader
        title={`Editar Perfil: ${role.name}`}
        description="Altere o nome e as permissões do perfil"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} disabled={saving}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button onClick={handleSubmit} disabled={saving || !name.trim()}>
              <Icon icon={Save} size={16} className="mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <form onSubmit={handleSubmit}>
        <Card className="p-6 mb-6">
          <FormField
            label="Nome do perfil"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Gerente de Filial"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Permissões</h3>
          <div className="space-y-6">
            {Object.entries(PERMISSIONS_BY_RESOURCE).map(([resource, codes]) => (
              <div key={resource}>
                <Label className="block font-medium mb-2">
                  {RESOURCE_LABELS[resource] ?? resource}
                </Label>
                <div className="flex flex-wrap gap-3">
                  {codes.map((code) => (
                    <label key={code} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.has(code)}
                        onChange={() => togglePermission(code)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{code.split('.')[1]}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </form>
    </AppLayout>
  );
};

export default EditRole;
