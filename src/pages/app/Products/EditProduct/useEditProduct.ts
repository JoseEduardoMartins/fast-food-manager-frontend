/**
 * useEditProduct Hook
 * Price: form in reais, API in centavos
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { getProductById, updateProduct } from '@services/products';
import type { Product } from '@services/products';
import { productFormSchema, type ProductFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        ingredients: (data.ingredients ?? []).map((i) => ({
          id: i.id,
          ingredientId: i.ingredientId,
          units: i.units,
          quantityPerUnit: i.quantityPerUnit,
        })),
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

  const onSubmit = async (data: ProductFormData) => {
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      const priceCentavos = Math.round(Number(data.price) * 100);
      const ingredients = (data.ingredients ?? [])
        .filter((i) => i.ingredientId >= 1)
        .map((i) => ({
          ...(i.id && { id: i.id }),
          ingredientId: i.ingredientId,
          units: i.units,
          quantityPerUnit: i.quantityPerUnit,
        }));
      await updateProduct(id, {
        name: data.name,
        description: data.description?.trim() || undefined,
        price: priceCentavos,
        isActive: data.isActive,
        ingredients,
      });
      toast.success('Produto atualizado com sucesso!');
      navigate(ROUTES.PRODUCTS_DETAILS.replace(':id', id));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao atualizar produto';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (id) navigate(ROUTES.PRODUCTS_DETAILS.replace(':id', id));
    else navigate(ROUTES.PRODUCTS);
  };

  return {
    product,
    loading,
    saving,
    error,
    setError,
    form,
    onSubmit,
    handleCancel,
  };
};
