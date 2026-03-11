/**
 * useProductDetails Hook
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { getProductById, updateProduct, deleteProduct } from '@services/products';
import type { Product } from '@services/products';
import { productFormSchema, type ProductFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema) as Resolver<ProductFormData>,
  });

  useEffect(() => {
    if (!id) {
      navigate(ROUTES.PRODUCTS);
      return;
    }
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
      form.reset({
        name: data.name,
        description: data.description ?? '',
        price: data.price / 100,
        isActive: data.isActive,
      });
      setError(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao carregar produto');
      toast.error('Erro ao carregar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    if (!id || !product) return;
    try {
      setToggling(true);
      setError(null);
      await updateProduct(id, { isActive: !product.isActive });
      toast.success(
        `Produto ${product.isActive ? 'desativado' : 'ativado'} com sucesso!`
      );
      await loadProduct();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao alterar status');
      toast.error(e.response?.data?.message ?? 'Erro ao alterar status');
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !product) return;
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o produto "${product.name}"? Não é possível excluir um produto em uso.`
    );
    if (!confirmed) return;
    try {
      await deleteProduct(id);
      toast.success('Produto excluído com sucesso!');
      navigate(ROUTES.PRODUCTS);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number } };
      const msg = e.response?.data?.message ?? 'Erro ao excluir produto';
      if (e.response?.status === 409) {
        setError('Produto está em uso e não pode ser removido.');
        toast.error('Produto está em uso e não pode ser removido.');
      } else {
        setError(msg);
        toast.error(msg);
      }
    }
  };

  const handleEdit = () => {
    if (id) navigate(ROUTES.PRODUCTS_EDIT.replace(':id', id));
  };

  const handleBack = () => {
    navigate(ROUTES.PRODUCTS);
  };

  return {
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
  };
};
