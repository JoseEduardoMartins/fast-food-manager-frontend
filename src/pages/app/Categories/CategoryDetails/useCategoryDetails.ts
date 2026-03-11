/**
 * useCategoryDetails Hook
 * Loads category by ID, then menu by menuId to get product list (one extra request)
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getCategoryById, updateCategory, deleteCategory } from '@services/categories';
import { getMenuById } from '@services/menus';
import {
  createCategoryProduct,
  deleteCategoryProduct,
} from '@services/category-products';
import type { Category } from '@services/categories';
import type { CategoryProductItemInMenu } from '@services/menus';
import { ROUTES } from '@common/constants';

export const useCategoryDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [menuName, setMenuName] = useState<string>('');
  const [products, setProducts] = useState<CategoryProductItemInMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  const loadCategory = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const cat = await getCategoryById(id);
      setCategory(cat);
      setError(null);
      // Load menu to get name and products of this category
      const menu = await getMenuById(cat.menuId);
      setMenuName(menu.name);
      const catWithProducts = menu.categories?.find((c) => c.id === cat.id);
      setProducts(catWithProducts?.products ?? []);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao carregar categoria');
      toast.error('Erro ao carregar categoria');
      setCategory(null);
      setMenuName('');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      navigate(ROUTES.CATEGORIES);
      return;
    }
    loadCategory();
  }, [id, navigate, loadCategory]);

  const handleToggleActive = async () => {
    if (!id || !category) return;
    try {
      setToggling(true);
      setError(null);
      await updateCategory(id, { isActive: !category.isActive });
      toast.success(
        `Categoria ${category.isActive ? 'desativada' : 'ativada'} com sucesso!`
      );
      await loadCategory();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao alterar status');
      toast.error(e.response?.data?.message ?? 'Erro ao alterar status');
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !category) return;
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a categoria "${category.name}"? Remova os produtos vinculados antes se necessário.`
    );
    if (!confirmed) return;
    try {
      await deleteCategory(id);
      toast.success('Categoria excluída com sucesso!');
      navigate(ROUTES.CATEGORIES);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number } };
      const msg = e.response?.data?.message ?? 'Erro ao excluir categoria';
      if (e.response?.status === 409) {
        setError('Categoria possui produtos vinculados. Remova os vínculos antes.');
        toast.error('Categoria possui produtos vinculados. Remova os vínculos antes.');
      } else {
        setError(msg);
        toast.error(msg);
      }
    }
  };

  const handleLinkProduct = async (productId: string) => {
    if (!id) return;
    try {
      await createCategoryProduct({
        categoryId: id,
        productId,
        order: products.length,
      });
      toast.success('Produto vinculado à categoria.');
      await loadCategory();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? 'Erro ao vincular produto');
      throw e;
    }
  };

  const handleUnlinkProduct = async (linkId: string, productName: string) => {
    const confirmed = window.confirm(
      `Remover "${productName}" desta categoria?`
    );
    if (!confirmed) return;
    try {
      await deleteCategoryProduct(linkId);
      toast.success('Produto removido da categoria.');
      await loadCategory();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? 'Erro ao remover');
    }
  };

  const handleEdit = () => {
    if (id) navigate(ROUTES.CATEGORIES_EDIT.replace(':id', id));
  };

  const handleBack = () => {
    navigate(ROUTES.CATEGORIES);
  };

  return {
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
    loadCategory,
  };
};
