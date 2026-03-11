/**
 * useMenuDetails Hook
 * Single request: GET /menus/:id returns menu with categories and products
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getMenuById, updateMenu, deleteMenu } from '@services/menus';
import type { MenuWithCategories, CategoryInMenu } from '@services/menus';
import { createCategory, deleteCategory } from '@services/categories';
import {
  createCategoryProduct,
  deleteCategoryProduct,
} from '@services/category-products';
import type { CategoryProduct } from '@services/category-products';
import { menuFormSchema, type MenuFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export type CategoryWithProducts = CategoryInMenu & {
  links: Pick<CategoryProduct, 'id' | 'productId' | 'order'>[];
  productNames: Record<string, string>;
};

function mapCategoriesFromMenu(
  categories: CategoryInMenu[] = []
): CategoryWithProducts[] {
  return categories.map((cat) => ({
    ...cat,
    links: cat.products.map((p) => ({
      id: p.id,
      productId: p.productId,
      order: p.order,
    })),
    productNames: Object.fromEntries(
      cat.products.map((p) => [p.productId, p.product.name])
    ),
  }));
}

export const useMenuDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState<MenuWithCategories | null>(null);
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<
    CategoryWithProducts[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  const form = useForm<MenuFormData>({
    resolver: zodResolver(menuFormSchema),
  });

  const loadMenu = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getMenuById(id);
      setMenu(data);
      setCategoriesWithProducts(mapCategoriesFromMenu(data.categories));
      form.reset({
        name: data.name,
        isActive: data.isActive,
      });
      setError(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao carregar menu');
      toast.error('Erro ao carregar menu');
      setMenu(null);
      setCategoriesWithProducts([]);
    } finally {
      setLoading(false);
    }
  }, [id, form]);

  useEffect(() => {
    if (!id) {
      navigate(ROUTES.MENUS);
      return;
    }
    loadMenu();
  }, [id, navigate, loadMenu]);

  const handleToggleActive = async () => {
    if (!id || !menu) return;
    try {
      setToggling(true);
      setError(null);
      await updateMenu(id, { isActive: !menu.isActive });
      toast.success(
        `Menu ${menu.isActive ? 'desativado' : 'ativado'} com sucesso!`
      );
      await loadMenu();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao alterar status');
      toast.error(e.response?.data?.message ?? 'Erro ao alterar status');
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !menu) return;
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o menu "${menu.name}"? Não é possível excluir um menu vinculado a filiais.`
    );
    if (!confirmed) return;
    try {
      await deleteMenu(id);
      toast.success('Menu excluído com sucesso!');
      navigate(ROUTES.MENUS);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number } };
      const msg = e.response?.data?.message ?? 'Erro ao excluir menu';
      if (e.response?.status === 409) {
        setError('Menu está em uso por uma ou mais filiais.');
        toast.error('Menu está em uso por uma ou mais filiais.');
      } else {
        setError(msg);
        toast.error(msg);
      }
    }
  };

  const handleEdit = () => {
    if (id) navigate(ROUTES.MENUS_EDIT.replace(':id', id));
  };

  const handleBack = () => {
    navigate(ROUTES.MENUS);
  };

  const handleAddCategory = async (
    name: string,
    order: number,
    productId?: string
  ) => {
    if (!id) return;
    try {
      const { id: categoryId } = await createCategory({
        menuId: id,
        name,
        order,
        isActive: true,
      });
      if (productId) {
        await createCategoryProduct({
          categoryId,
          productId,
          order: 0,
        });
      }
      toast.success('Categoria criada com sucesso!');
      await loadMenu();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number } };
      const msg = e.response?.data?.message ?? 'Erro ao criar categoria';
      toast.error(msg);
      setError(msg);
      throw e;
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a categoria "${categoryName}"?`
    );
    if (!confirmed) return;
    try {
      await deleteCategory(categoryId);
      toast.success('Categoria excluída com sucesso!');
      await loadMenu();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number } };
      const msg = e.response?.data?.message ?? 'Erro ao excluir categoria';
      if (e.response?.status === 409) {
        toast.error('Categoria possui vínculos e não pode ser removida.');
      } else {
        toast.error(msg);
      }
      setError(msg);
    }
  };

  const handleLinkProductToCategory = async (
    categoryId: string,
    productId: string
  ) => {
    try {
      await createCategoryProduct({
        categoryId,
        productId,
        order: 0,
      });
      toast.success('Produto vinculado à categoria com sucesso!');
      await loadMenu();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number } };
      const msg = e.response?.data?.message ?? 'Erro ao vincular produto';
      toast.error(msg);
      setError(msg);
      throw e;
    }
  };

  const handleUnlinkProductFromCategory = async (
    linkId: string,
    productName: string
  ) => {
    const confirmed = window.confirm(
      `Remover "${productName}" desta categoria?`
    );
    if (!confirmed) return;
    try {
      await deleteCategoryProduct(linkId);
      toast.success('Produto removido da categoria.');
      await loadMenu();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? 'Erro ao remover');
      setError(e.response?.data?.message ?? 'Erro ao remover');
    }
  };

  return {
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
    loadMenu,
  };
};
