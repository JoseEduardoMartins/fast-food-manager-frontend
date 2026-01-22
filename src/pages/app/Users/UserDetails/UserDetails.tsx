/**
 * UserDetails Page
 * Page for viewing user details
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { UserForm } from '../components';
import { useUserDetails } from './useUserDetails';

const UserDetails: React.FC = () => {
  const { user: currentUser, signOut } = useAuth();
  const {
    user,
    loading,
    error,
    setError,
    toggling,
    form,
    handleToggleActive,
    handleDelete,
    handleEdit,
    handleBack,
  } = useUserDetails();

  if (loading) {
    return (
      <AppLayout user={currentUser} onSignOut={signOut}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600 dark:text-gray-400">Carregando detalhes do usuário...</div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout user={currentUser} onSignOut={signOut}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <ErrorAlert message="Usuário não encontrado." dismissible={false} />
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
        title={`Detalhes do Usuário: ${user.name}`}
        description="Visualize as informações completas do usuário"
        action={
          <Button variant="outline" onClick={handleBack}>
            <Icon icon={ArrowLeft} size={16} className="mr-2" />
            Voltar
          </Button>
        }
      />

      <ErrorAlert message={error || ''} onDismiss={() => setError(null)} dismissible />

      <Card className="max-w-4xl mx-auto p-6">
        <FormProvider {...form}>
          <form className="space-y-6">
            <UserForm mode="view" isViewOnly user={user} />

            <div className="flex flex-col gap-4 pt-4 border-t border-border">
              <Button onClick={handleEdit}>
                <Icon icon={Edit} size={16} className="mr-2" />
                Editar Usuário
              </Button>
              <Button
                variant={user.isActive ? 'warning' : 'success'}
                onClick={handleToggleActive}
                disabled={toggling}
              >
                <Icon icon={user.isActive ? UserX : UserCheck} size={16} className="mr-2" />
                {toggling ? 'Alterando...' : user.isActive ? 'Desativar Usuário' : 'Ativar Usuário'}
              </Button>
              <Button
                variant="error"
                onClick={handleDelete}
              >
                <Icon icon={Trash2} size={16} className="mr-2" />
                Excluir Usuário
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default UserDetails;
