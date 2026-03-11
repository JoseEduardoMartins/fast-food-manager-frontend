/**
 * CreateProduct Page
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { ProductForm } from '../components';
import { useCreateProduct } from './useCreateProduct';
import type { ProductFormData } from '../schemas';

const CreateProduct: React.FC = () => {
  const { user, signOut } = useAuth();
  const { form, isLoading, error, setError, onSubmit, handleCancel } = useCreateProduct();

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title="Novo Produto"
        description="Cadastre um novo produto"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button onClick={form.handleSubmit((d) => onSubmit(d as unknown as ProductFormData))} disabled={isLoading}>
              <Icon icon={Save} size={16} className="mr-2" />
              {isLoading ? 'Criando...' : 'Criar Produto'}
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit((d) => onSubmit(d as unknown as ProductFormData))}>
            <ProductForm mode="create" />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default CreateProduct;
