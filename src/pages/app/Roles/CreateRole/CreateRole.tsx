/**
 * CreateRole Page
 */

import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card, FormField, Label } from '@components';
import { useAuth } from '@contexts';
import { PERMISSIONS_BY_RESOURCE, RESOURCE_LABELS } from '@common/constants';
import { useCreateRole } from './useCreateRole';

const CreateRole: React.FC = () => {
  const { user: currentUser, signOut } = useAuth();
  const { loading, error, setError, onSubmit, onCancel } = useCreateRole();
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  const togglePermission = (code: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), permissions: Array.from(selectedPermissions) });
  };

  return (
    <AppLayout user={currentUser} onSignOut={signOut}>
      <PageHeader
        title="Novo Perfil de Acesso"
        description="Crie um perfil customizado e defina as permissões"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !name.trim()}>
              <Icon icon={Save} size={16} className="mr-2" />
              {loading ? 'Salvando...' : 'Criar Perfil'}
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
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Marque as permissões que este perfil terá.
          </p>
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

export default CreateRole;
