/**
 * EditStock Page - edit branch-ingredient (branch/ingredient read-only)
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { StockForm } from '../components';
import { useEditStock } from './useEditStock';
import type { StockFormData } from '../schemas';

const EditStock: React.FC = () => {
  const { user, signOut } = useAuth();
  const { item, loading, saving, error, setError, form, onSubmit, handleCancel } = useEditStock();

  if (loading) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Carregando..." />
        <Card className="p-6">Carregando...</Card>
      </AppLayout>
    );
  }

  if (!item) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Não encontrado" />
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
        title="Editar estoque"
        description="Atualize quantidade e preços"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button
              onClick={form.handleSubmit((d) => onSubmit(d as unknown as StockFormData))}
              disabled={saving}
            >
              <Icon icon={Save} size={16} className="mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        }
      />
      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />
      <Card className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit((d) => onSubmit(d as unknown as StockFormData))}>
            <StockForm mode="edit" branchId={item.branchId} ingredientId={item.ingredientId} />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default EditStock;
