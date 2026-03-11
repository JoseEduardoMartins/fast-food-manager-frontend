/**
 * CategoryDetails Page
 */

import React, { useState, useEffect } from 'react';
import { FormProvider, useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Edit, Trash2, Power, Link2, X } from 'lucide-react';
import {
  AppLayout,
  PageHeader,
  ErrorAlert,
  Button,
  Icon,
  Card,
} from '@components';
import { useAuth } from '@contexts';
import { CategoryForm } from '../components';
import { LinkProductModal } from '../../Menus/MenuDetails/LinkProductModal';
import { useCategoryDetails } from './useCategoryDetails';
import { categoryEditFormSchema, type CategoryEditFormData } from '../schemas';

const CategoryDetails: React.FC = () => {
  const { user, signOut } = useAuth();
  const {
    category,
    menuName,
    products,
    loading,
    error,
    setError,
    toggling,
    handleToggleActive,
    handleDelete,
    handleLinkProduct,
    handleUnlinkProduct,
    handleEdit,
    handleBack,
  } = useCategoryDetails();

  const [linkProductModalOpen, setLinkProductModalOpen] = useState(false);

  const form = useForm<CategoryEditFormData>({
    resolver: zodResolver(categoryEditFormSchema) as Resolver<CategoryEditFormData>,
    defaultValues: {
      name: '',
      order: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        order: category.order,
        isActive: category.isActive,
      });
    }
  }, [category, form]);

  if (loading) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Carregando..." />
        <Card className="p-6">Carregando dados da categoria...</Card>
      </AppLayout>
    );
  }

  if (!category) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Categoria não encontrada" />
        <Card className="p-6">
          <p>Categoria não encontrada.</p>
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
        title={category.name}
        description="Detalhes da categoria e produtos vinculados"
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
              {category.isActive ? 'Desativar' : 'Ativar'}
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
          <CategoryForm
            mode="view"
            category={category}
            menuName={menuName}
          />
        </FormProvider>
      </Card>

      <Card className="p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Produtos na categoria</h2>
          <Button onClick={() => setLinkProductModalOpen(true)}>
            <Icon icon={Link2} size={16} className="mr-2" />
            Vincular produto
          </Button>
        </div>
        {products.length === 0 ? (
          <p className="text-muted-foreground py-4">
            Nenhum produto vinculado. Clique em &quot;Vincular produto&quot; para adicionar.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {products.map((item) => (
              <li
                key={item.id}
                className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded"
              >
                <span>{item.product.name}</span>
                <button
                  type="button"
                  onClick={() =>
                    handleUnlinkProduct(item.id, item.product.name)
                  }
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Remover produto"
                >
                  <Icon icon={X} size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <LinkProductModal
        isOpen={linkProductModalOpen}
        onClose={() => setLinkProductModalOpen(false)}
        existingProductIds={products.map((p) => p.productId)}
        onLink={async (productId) => {
          await handleLinkProduct(productId);
          setLinkProductModalOpen(false);
        }}
        title="Vincular produto à categoria"
      />
    </AppLayout>
  );
};

export default CategoryDetails;
