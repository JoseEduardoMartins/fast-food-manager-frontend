/**
 * ProductDetails Page
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Edit, Trash2, Power } from 'lucide-react';
import {
  AppLayout,
  PageHeader,
  ErrorAlert,
  Button,
  Icon,
  Card,
} from '@components';
import { useAuth } from '@contexts';
import { ProductForm } from '../components';
import { useProductDetails } from './useProductDetails';

const ProductDetails: React.FC = () => {
  const { user, signOut } = useAuth();
  const {
    product,
    loading,
    error,
    setError,
    toggling,
    form,
    handleToggleActive,
    handleDelete,
    handleEdit,
    handleBack,
  } = useProductDetails();

  if (loading) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Carregando..." />
        <Card className="p-6">Carregando dados do produto...</Card>
      </AppLayout>
    );
  }

  if (!product) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Produto não encontrado" />
        <Card className="p-6">
          <p>Produto não encontrado.</p>
          <Button onClick={handleBack} className="mt-4">
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
        title={product.name}
        description="Detalhes do produto"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Icon icon={Edit} size={16} className="mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={handleToggleActive}
              disabled={toggling}
            >
              <Icon icon={Power} size={16} className="mr-2" />
              {product.isActive ? 'Desativar' : 'Ativar'}
            </Button>
            <Button variant="error" onClick={handleDelete}>
              <Icon icon={Trash2} size={16} className="mr-2" />
              Excluir
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-6">
        <FormProvider {...form}>
          <ProductForm mode="view" product={product} />
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default ProductDetails;
