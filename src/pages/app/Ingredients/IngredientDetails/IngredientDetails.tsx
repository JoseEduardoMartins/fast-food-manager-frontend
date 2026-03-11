/**
 * IngredientDetails Page
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import {
  AppLayout,
  PageHeader,
  ErrorAlert,
  Button,
  Icon,
  Card,
} from '@components';
import { useAuth } from '@contexts';
import { IngredientForm } from '../components';
import { useIngredientDetails } from './useIngredientDetails';

const IngredientDetails: React.FC = () => {
  const { user, signOut } = useAuth();
  const {
    ingredient,
    loading,
    error,
    setError,
    form,
    handleDelete,
    handleEdit,
    handleBack,
  } = useIngredientDetails();

  if (loading) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Carregando..." />
        <Card className="p-6">Carregando dados do ingrediente...</Card>
      </AppLayout>
    );
  }

  if (!ingredient) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Ingrediente não encontrado" />
        <Card className="p-6">
          <p>Ingrediente não encontrado.</p>
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
        title={ingredient.name}
        description="Detalhes do ingrediente"
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
          <IngredientForm mode="view" ingredient={ingredient} />
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default IngredientDetails;
