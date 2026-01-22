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
  const { user, loading, saving, error, setError, form, onSubmit, handleCancel } = useEditUser();

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
          <Button variant="outline" onClick={handleCancel}>
            <Icon icon={ArrowLeft} size={16} className="mr-2" />
            Voltar
          </Button>
        }
      />

      <ErrorAlert message={error || ''} onDismiss={() => setError(null)} dismissible />

      <Card className="max-w-4xl mx-auto p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <UserForm mode="edit" user={user} />

            <div className="flex gap-4 pt-4 border-t border-border">
              <Button
                type="submit"
                className="flex-1"
                disabled={saving}
              >
                <Icon icon={Save} size={16} className="mr-2" />
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                disabled={saving}
              >
                <Icon icon={ArrowLeft} size={16} className="mr-2" />
                Cancelar
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default EditUser;
