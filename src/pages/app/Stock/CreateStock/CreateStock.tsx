/**
 * CreateStock Page - new branch-ingredient
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { StockForm } from '../components';
import { useCreateStock } from './useCreateStock';
import type { StockFormData } from '../schemas';

const CreateStock: React.FC = () => {
  const { user, signOut } = useAuth();
  const { form, isLoading, error, setError, onSubmit, handleCancel } = useCreateStock();

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title="Novo registro de estoque"
        description="Cadastre estoque de ingrediente em uma filial"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button
              onClick={form.handleSubmit((d) => onSubmit(d as unknown as StockFormData))}
              disabled={isLoading}
            >
              <Icon icon={Save} size={16} className="mr-2" />
              {isLoading ? 'Criando...' : 'Criar'}
            </Button>
          </div>
        }
      />
      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />
      <Card className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit((d) => onSubmit(d as unknown as StockFormData))}>
            <StockForm mode="create" />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default CreateStock;
