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
            <UserForm mode="create" />

            <div className="flex gap-4 pt-4 border-t border-border">
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                <Icon icon={Save} size={16} className="mr-2" />
                {isLoading ? 'Criando...' : 'Criar Usuário'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                disabled={isLoading}
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

export default CreateUser;
