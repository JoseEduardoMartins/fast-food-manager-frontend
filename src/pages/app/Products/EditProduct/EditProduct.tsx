/**
 * EditProduct Page
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { ProductForm } from '../components';
import { useEditProduct } from './useEditProduct';
import type { ProductFormData } from '../schemas';

const EditProduct: React.FC = () => {
  const { user, signOut } = useAuth();
  const {
    product,
    loading,
    saving,
    error,
    setError,
    form,
    onSubmit,
    handleCancel,
  } = useEditProduct();

  if (loading) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Carregando..." />
        <Card className="p-6">Carregando produto...</Card>
      </AppLayout>
    );
  }

  if (!product) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Produto não encontrado" />
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
        title={`Editar Produto: ${product.name}`}
        description="Atualize os dados do produto"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button onClick={form.handleSubmit((d) => onSubmit(d as unknown as ProductFormData))} disabled={saving}>
              <Icon icon={Save} size={16} className="mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit((d) => onSubmit(d as unknown as ProductFormData))}>
            <ProductForm mode="edit" product={product} />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default EditProduct;
