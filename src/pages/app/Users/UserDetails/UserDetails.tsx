/**
 * UserDetails Page
 * Page for viewing user details
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { UserForm, UserInfoSubHeader } from '../components';
import { useUserDetails } from './useUserDetails';
import { PERMISSIONS } from '@common/constants/permissions';

const UserDetails: React.FC = () => {
  const { user: currentUser, signOut, hasPermission } = useAuth();
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
    reloadUser,
  } = useUserDetails();

  const canUpdate = hasPermission(PERMISSIONS.users.update);
  const canDelete = hasPermission(PERMISSIONS.users.delete);

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
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            {canUpdate && (
              <Button onClick={handleEdit}>
                <Icon icon={Edit} size={16} className="mr-2" />
                Editar
              </Button>
            )}
            {canUpdate && (
              <>
                <Button
                  variant={user.isActive ? 'warning' : 'success'}
                  onClick={handleToggleActive}
                  disabled={toggling}
                >
                  <Icon icon={user.isActive ? UserX : UserCheck} size={16} className="mr-2" />
                  {toggling ? 'Alterando...' : user.isActive ? 'Desativar' : 'Ativar'}
                </Button>
              </>
            )}
            {canDelete && (
              <Button
                variant="error"
                onClick={handleDelete}
              >
                <Icon icon={Trash2} size={16} className="mr-2" />
                Excluir
              </Button>
            )}
          </div>
        }
      />

      <ErrorAlert message={error || ''} onDismiss={() => setError(null)} dismissible />

      <UserInfoSubHeader user={user} />

      <Card className="p-6">
        <FormProvider {...form}>
          <form>
            <UserForm
              mode="view"
              user={user}
              onAddressChange={reloadUser}
            />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default UserDetails;
