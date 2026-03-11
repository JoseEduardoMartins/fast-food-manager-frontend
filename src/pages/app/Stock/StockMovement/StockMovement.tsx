/**
 * StockMovement Page - create ingredient-transaction (entrada/saída)
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { MovementForm } from '../components';
import { useCreateMovement } from './useCreateMovement';
import type { MovementFormData } from '../movementSchemas';

const StockMovement: React.FC = () => {
  const { user, signOut } = useAuth();
  const { form, isLoading, error, setError, onSubmit, handleCancel } = useCreateMovement();

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title="Nova movimentação"
        description="Registre entrada ou saída de ingrediente no estoque"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button
              onClick={form.handleSubmit((d) => onSubmit(d as unknown as MovementFormData))}
              disabled={isLoading}
            >
              <Icon icon={Save} size={16} className="mr-2" />
              {isLoading ? 'Registrando...' : 'Registrar'}
            </Button>
          </div>
        }
      />
      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />
      <Card className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit((d) => onSubmit(d as unknown as MovementFormData))}>
            <MovementForm />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default StockMovement;
