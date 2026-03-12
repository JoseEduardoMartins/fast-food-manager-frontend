/**
 * EditUser Page
 * Page for editing user details
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { UserForm } from '../components';
import { useEditUser } from './useEditUser';

const EditUser: React.FC = () => {
  const { user: currentUser, signOut } = useAuth();
  const { user, loading, saving, error, setError, form, onSubmit, handleCancel, reloadUser, handleAddressesChange, addresses, roles, rolesLoading } = useEditUser();

  if (loading) {
    return (
      <AppLayout user={currentUser} onSignOut={signOut}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600 dark:text-gray-400">Carregando dados do usuário...</div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout user={currentUser} onSignOut={signOut}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <ErrorAlert message="Usuário não encontrado para edição." dismissible={false} />
            <Button onClick={handleCancel} className="mt-4">
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={currentUser} onSignOut={signOut}>
      <PageHeader
        title={`Editar Usuário: ${user.name}`}
        description="Atualize as informações do usuário"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={saving}>
              <Icon icon={Save} size={16} className="mr-2" />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error || ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <UserForm
              mode="edit"
              user={user}
              addresses={addresses}
              onAddressChange={reloadUser}
              onAddressesChange={handleAddressesChange}
              roles={roles}
              rolesLoading={rolesLoading}
            />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default EditUser;
