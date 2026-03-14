/**
 * useCreateProduct Hook
 * Price: form in reais, API in centavos
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { createProduct } from '@services/products';
import { productFormSchema, type ProductFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useCreateProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema) as Resolver<ProductFormData>,
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      isActive: true,
      ingredients: [],
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const priceCentavos = Math.round(Number(data.price) * 100);
      const ingredients = (data.ingredients ?? [])
        .filter((i) => i.ingredientId >= 1)
        .map((i) => ({
          ingredientId: i.ingredientId,
          units: i.units,
          quantityPerUnit: i.quantityPerUnit,
        }));
      const { id } = await createProduct({
        name: data.name,
        description: data.description?.trim() || undefined,
        price: priceCentavos,
        isActive: data.isActive,
        ingredients: ingredients.length > 0 ? ingredients : undefined,
      });
      toast.success('Produto criado com sucesso!');
      navigate(ROUTES.PRODUCTS_DETAILS.replace(':id', id));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao criar produto';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.PRODUCTS);
  };

  return { form, isLoading, error, setError, onSubmit, handleCancel };
};
