/**
 * StockForm (branch-ingredient) - prices in reais in form
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, AsyncSelect } from '@components';
import type { Branch } from '@services/branches';
import type { Ingredient } from '@services/ingredients';
import type { StockFormData } from '../schemas';
import { listBranches } from '@services/branches';
import { listIngredients } from '@services/ingredients';
import type { ListBranchesParams } from '@services/branches';
import type { ListIngredientsParams } from '@services/ingredients';

interface StockFormProps {
  mode: 'create' | 'view' | 'edit';
  branchId?: string;
  ingredientId?: string;
}

export const StockForm: React.FC<StockFormProps> = ({
  mode,
  branchId,
  ingredientId,
}) => {
  const isViewOnly = mode === 'view';
  const { register, setValue, watch, formState: { errors } } = useFormContext<StockFormData>();

  const loadBranches = async (params?: ListBranchesParams) => {
    const res = await listBranches({
      pageSize: 200,
      sort: { fields: ['name'], order: ['ASC'] },
      ...params,
    });
    return res.data;
  };

  const loadIngredients = async (params?: ListIngredientsParams) => {
    const res = await listIngredients({
      pageSize: 200,
      sort: { fields: ['name'], order: ['ASC'] },
      ...params,
    });
    return res.data;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <AsyncSelect<Branch, ListBranchesParams>
            label="Filial"
            value={watch('branchId') || branchId || ''}
            onChange={(e) => setValue('branchId', e.target.value)}
            loadOptions={loadBranches}
            getValue={(b) => b.id}
            getLabel={(b) => b.name}
            placeholder="Selecione a filial"
            disabled={isViewOnly || mode === 'edit'}
            reloadOnParamsChange={false}
          />
          {errors.branchId && (
            <p className="text-sm text-error mt-1">{errors.branchId.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <AsyncSelect<Ingredient, ListIngredientsParams>
            label="Ingrediente"
            value={watch('ingredientId') || ingredientId || ''}
            onChange={(e) => setValue('ingredientId', e.target.value)}
            loadOptions={loadIngredients}
            getValue={(i) => i.id}
            getLabel={(i) => i.name}
            placeholder="Selecione o ingrediente"
            disabled={isViewOnly || mode === 'edit'}
            reloadOnParamsChange={false}
          />
          {errors.ingredientId && (
            <p className="text-sm text-error mt-1">{errors.ingredientId.message}</p>
          )}
        </div>
        <FormField
          label="Quantidade em estoque"
          type="number"
          min={0}
          step="any"
          required={!isViewOnly}
          {...register('stockQuantity')}
          error={!!errors.stockQuantity}
          errorText={errors.stockQuantity?.message}
          disabled={isViewOnly}
        />
        <FormField
          label="Estoque mínimo (alerta)"
          type="number"
          min={0}
          step="any"
          required={!isViewOnly}
          {...register('stockMinQuantity')}
          error={!!errors.stockMinQuantity}
          errorText={errors.stockMinQuantity?.message}
          disabled={isViewOnly}
        />
        <FormField
          label="Preço de compra (R$)"
          type="number"
          step="0.01"
          min={0}
          required={!isViewOnly}
          {...register('purchasePrice')}
          error={!!errors.purchasePrice}
          errorText={errors.purchasePrice?.message}
          disabled={isViewOnly}
        />
        <FormField
          label="Preço de venda (R$)"
          type="number"
          step="0.01"
          min={0}
          {...register('salePrice')}
          error={!!errors.salePrice}
          errorText={errors.salePrice?.message}
          disabled={isViewOnly}
        />
      </div>
    </div>
  );
};
