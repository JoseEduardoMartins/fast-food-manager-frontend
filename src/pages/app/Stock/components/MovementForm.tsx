/**
 * MovementForm - create ingredient-transaction (input/output)
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, Label, Select, AsyncSelect } from '@components';
import type { Branch } from '@services/branches';
import type { Ingredient } from '@services/ingredients';
import type { MovementFormData } from '../movementSchemas';
import { listBranches } from '@services/branches';
import { listIngredients } from '@services/ingredients';
import type { ListBranchesParams } from '@services/branches';
import type { ListIngredientsParams } from '@services/ingredients';

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

export const MovementForm: React.FC = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext<MovementFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <AsyncSelect<Branch, ListBranchesParams>
            label="Filial"
            value={watch('branchId')}
            onChange={(e) => setValue('branchId', e.target.value)}
            loadOptions={loadBranches}
            getValue={(b) => b.id}
            getLabel={(b) => b.name}
            placeholder="Selecione a filial"
            reloadOnParamsChange={false}
          />
          {errors.branchId && (
            <p className="text-sm text-error mt-1">{errors.branchId.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <AsyncSelect<Ingredient, ListIngredientsParams>
            label="Ingrediente"
            value={watch('ingredientId')}
            onChange={(e) => setValue('ingredientId', e.target.value)}
            loadOptions={loadIngredients}
            getValue={(i) => String(i.id)}
            getLabel={(i) => i.name}
            placeholder="Selecione o ingrediente"
            reloadOnParamsChange={false}
          />
          {errors.ingredientId && (
            <p className="text-sm text-error mt-1">{errors.ingredientId.message}</p>
          )}
        </div>
        <div>
          <Label className="mb-2 block">Tipo</Label>
          <Select
            value={watch('type')}
            onChange={(e) =>
              setValue('type', e.target.value as MovementFormData['type'])
            }
          >
            <option value="input">Entrada</option>
            <option value="output">Saída</option>
          </Select>
        </div>
        <FormField
          label="Quantidade"
          type="number"
          min={1}
          step="any"
          required
          {...register('quantity')}
          error={!!errors.quantity}
          errorText={errors.quantity?.message}
        />
        <FormField
          label="Preço unitário (R$) - opcional"
          type="number"
          step="0.01"
          min={0}
          {...register('unitPrice')}
          error={!!errors.unitPrice}
          errorText={errors.unitPrice?.message}
        />
        <div className="md:col-span-2">
          <FormField
            label="Descrição (opcional)"
            placeholder="Ex: Compra semanal"
            {...register('description')}
            error={!!errors.description}
            errorText={errors.description?.message}
          />
        </div>
      </div>
    </div>
  );
};
