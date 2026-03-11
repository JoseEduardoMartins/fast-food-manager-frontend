/**
 * EditIngredient Page
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout, PageHeader, ErrorAlert, Button, Icon, Card } from '@components';
import { useAuth } from '@contexts';
import { IngredientForm } from '../components';
import { useEditIngredient } from './useEditIngredient';
import type { IngredientFormData } from '../schemas';

const EditIngredient: React.FC = () => {
  const { user, signOut } = useAuth();
  const {
    ingredient,
    loading,
    saving,
    error,
    setError,
    form,
    onSubmit,
    handleCancel,
  } = useEditIngredient();

  if (loading) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Carregando..." />
        <Card className="p-6">Carregando ingrediente...</Card>
      </AppLayout>
    );
  }

  if (!ingredient) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Ingrediente não encontrado" />
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
        title={`Editar Ingrediente: ${ingredient.name}`}
        description="Atualize os dados do ingrediente"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button onClick={form.handleSubmit((d) => onSubmit(d as unknown as IngredientFormData))} disabled={saving}>
              <Icon icon={Save} size={16} className="mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit((d) => onSubmit(d as unknown as IngredientFormData))}>
            <IngredientForm mode="edit" ingredient={ingredient} />
          </form>
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default EditIngredient;
