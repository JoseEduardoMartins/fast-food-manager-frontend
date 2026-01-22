/**
 * CreateUser Page
 * Page for creating new users
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { UserForm } from '../components';
import { useCreateUser } from './useCreateUser';

const CreateUser: React.FC = () => {
  const { user, signOut } = useAuth();
  const { form, isLoading, error, setError, onSubmit, handleCancel } = useCreateUser();

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title="Novo Usuário"
        description="Cadastre um novo usuário no sistema"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
              <Icon icon={Save} size={16} className="mr-2" />
              {isLoading ? 'Criando...' : 'Criar Usuário'}
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error || ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <UserForm mode="create" />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default CreateUser;
