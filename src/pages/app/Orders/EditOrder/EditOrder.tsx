/**
 * EditOrder Page
 * Edit order and items
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { OrderForm } from '../components';
import { useEditOrder } from './useEditOrder';
import type { OrderFormData } from '../schemas';

const EditOrder: React.FC = () => {
  const { user, signOut } = useAuth();
  const {
    order,
    loading,
    saving,
    error,
    setError,
    form,
    onSubmit,
    handleCancel,
  } = useEditOrder();

  if (loading) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Carregando..." />
        <Card className="p-6">Carregando pedido...</Card>
      </AppLayout>
    );
  }

  if (!order) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Pedido não encontrado" />
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
        title={`Editar Pedido #${order.id.slice(0, 8)}`}
        description="Atualize o pedido"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button onClick={form.handleSubmit((d) => onSubmit(d as unknown as OrderFormData))} disabled={saving}>
              <Icon icon={Save} size={16} className="mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit((d) => onSubmit(d as unknown as OrderFormData))}>
            <OrderForm isViewOnly={false} branchId={order.branchId} />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default EditOrder;
