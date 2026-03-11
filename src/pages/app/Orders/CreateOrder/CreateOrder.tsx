/**
 * CreateOrder Page
 * Create new order with items
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { OrderForm } from '../components';
import { useCreateOrder } from './useCreateOrder';
import type { OrderFormData } from '../schemas';

const CreateOrder: React.FC = () => {
  const { user, signOut } = useAuth();
  const { form, isLoading, error, setError, onSubmit, handleCancel } = useCreateOrder();

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title="Novo Pedido"
        description="Cadastre um novo pedido"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button onClick={form.handleSubmit((d) => onSubmit(d as unknown as OrderFormData))} disabled={isLoading}>
              <Icon icon={Save} size={16} className="mr-2" />
              {isLoading ? 'Criando...' : 'Criar Pedido'}
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit((d) => onSubmit(d as unknown as OrderFormData))}>
            <OrderForm />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default CreateOrder;
