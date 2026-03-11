/**
 * ProductForm Component
 * Price in reais in form; API uses centavos
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, Label } from '@components';
import type { Product } from '@services/products';
import type { ProductFormData } from '../schemas';

interface ProductFormProps {
  mode: 'create' | 'view' | 'edit';
  product?: Product;
}

export const ProductForm: React.FC<ProductFormProps> = ({ mode, product }) => {
  const isViewOnly = mode === 'view';
  const { register, formState: { errors } } = useFormContext<ProductFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Nome do produto"
          required={!isViewOnly}
          {...register('name')}
          error={!!errors.name}
          errorText={errors.name?.message}
          placeholder="Ex: Hambúrguer Artesanal"
          disabled={isViewOnly}
        />
        <FormField
          label="Preço (R$)"
          type="number"
          step="0.01"
          min={0}
          required={!isViewOnly}
          {...register('price')}
          error={!!errors.price}
          errorText={errors.price?.message}
          placeholder="0,00"
          disabled={isViewOnly}
        />
      </div>

      <div>
        <FormField
          label="Descrição"
          {...register('description')}
          error={!!errors.description}
          errorText={errors.description?.message}
          placeholder="Descrição opcional do produto"
          disabled={isViewOnly}
        />
      </div>

      {mode === 'create' ? (
        <div>
          <Label className="mb-2 block">Status</Label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('isActive')}
              className="rounded border-input"
            />
            <span>Produto ativo</span>
          </label>
        </div>
      ) : mode === 'view' && product ? (
        <div>
          <Label className="mb-2 block">Status</Label>
          <p className="py-2">{product.isActive ? 'Ativo' : 'Inativo'}</p>
        </div>
      ) : mode === 'edit' ? (
        <div>
          <Label className="mb-2 block">Status</Label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('isActive')}
              className="rounded border-input"
            />
            <span>Produto ativo</span>
          </label>
        </div>
      ) : null}
    </div>
  );
};
