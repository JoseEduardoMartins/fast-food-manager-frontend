/**
 * EditMenu Page
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { MenuForm } from '../components';
import { useEditMenu } from './useEditMenu';

const EditMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const {
    menu,
    loading,
    saving,
    error,
    setError,
    form,
    onSubmit,
    handleCancel,
  } = useEditMenu();

  if (loading) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Carregando..." />
        <Card className="p-6">Carregando menu...</Card>
      </AppLayout>
    );
  }

  if (!menu) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Menu não encontrado" />
        <Card className="p-6">
          <Button onClick={handleCancel}>
            <Icon icon={ArrowLeft} size={16} className="mr-2" />
            Voltar
          </Button>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title={`Editar Menu: ${menu.name}`}
        description="Atualize os dados do menu"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={saving}>
              <Icon icon={Save} size={16} className="mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <MenuForm mode="edit" menu={menu} />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default EditMenu;
