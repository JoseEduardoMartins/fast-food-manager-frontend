/**
 * MenuDetails Page
 * Menu + Categories (with products linked via category-product)
 */

import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Edit, Trash2, Power, Plus, Link2, X } from 'lucide-react';
import {
  AppLayout,
  PageHeader,
  ErrorAlert,
  Button,
  Icon,
  Card,
  Badge,
} from '@components';
import { useAuth } from '@contexts';
import { MenuForm } from '../components';
import { useMenuDetails, type CategoryWithProducts } from './useMenuDetails';
import { AddCategoryModal } from './AddCategoryModal';
import { LinkProductModal } from './LinkProductModal';

const MenuDetails: React.FC = () => {
  const { user, signOut } = useAuth();
  const {
    menu,
    categoriesWithProducts,
    loading,
    error,
    setError,
    toggling,
    form,
    handleToggleActive,
    handleDelete,
    handleAddCategory,
    handleDeleteCategory,
    handleLinkProductToCategory,
    handleUnlinkProductFromCategory,
    handleEdit,
    handleBack,
  } = useMenuDetails();

  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [linkProductCategory, setLinkProductCategory] = useState<CategoryWithProducts | null>(null);

  const handleAddCategorySubmit = async (
    name: string,
    order: number,
    productId?: string
  ) => {
    await handleAddCategory(name, order, productId);
    setAddCategoryModalOpen(false);
  };

  if (loading) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Carregando..." />
        <Card className="p-6">Carregando dados do menu...</Card>
      </AppLayout>
    );
  }

  if (!menu) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Menu não encontrado" />
        <Card className="p-6">
          <p>Menu não encontrado.</p>
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
        title={menu.name}
        description="Detalhes do menu e categorias"
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
              {menu.isActive ? 'Desativar' : 'Ativar'}
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
          <MenuForm mode="view" menu={menu} />
        </FormProvider>
      </Card>

      <Card className="p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Categorias</h2>
          <Button onClick={() => setAddCategoryModalOpen(true)}>
            <Icon icon={Plus} size={16} className="mr-2" />
            Nova categoria
          </Button>
        </div>

        {categoriesWithProducts.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center">
            Nenhuma categoria. Clique em &quot;Nova categoria&quot; para adicionar e vincular produtos.
          </p>
        ) : (
          <div className="space-y-4">
            {categoriesWithProducts.map((cat) => (
              <div
                key={cat.id}
                className="border border-border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-muted-foreground text-sm">
                      (ordem: {cat.order})
                    </span>
                    <Badge variant={cat.isActive ? 'success' : 'error'}>
                      {cat.isActive ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLinkProductCategory(cat)}
                    >
                      <Icon icon={Link2} size={14} className="mr-1" />
                      Vincular produto
                    </Button>
                    <Button
                      variant="error"
                      size="sm"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    >
                      <Icon icon={Trash2} size={14} className="mr-1" />
                      Excluir categoria
                    </Button>
                  </div>
                </div>
                <div className="text-sm">
                  {cat.links.length === 0 ? (
                    <span className="text-muted-foreground">
                      Nenhum produto vinculado
                    </span>
                  ) : (
                    <ul className="flex flex-wrap gap-2">
                      {cat.links.map((link) => (
                        <li
                          key={link.id}
                          className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded"
                        >
                          <span>
                            {cat.productNames[link.productId] ?? link.productId}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleUnlinkProductFromCategory(
                                link.id,
                                cat.productNames[link.productId] ?? link.productId
                              )
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
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <AddCategoryModal
        isOpen={addCategoryModalOpen}
        onClose={() => setAddCategoryModalOpen(false)}
        onSubmit={handleAddCategorySubmit}
      />

      <LinkProductModal
        isOpen={!!linkProductCategory}
        onClose={() => setLinkProductCategory(null)}
        existingProductIds={linkProductCategory?.links.map((l) => l.productId) ?? []}
        onLink={async (productId) => {
          if (linkProductCategory) {
            await handleLinkProductToCategory(linkProductCategory.id, productId);
            setLinkProductCategory(null);
          }
        }}
        title="Vincular produto à categoria"
      />
    </AppLayout>
  );
};

export default MenuDetails;
