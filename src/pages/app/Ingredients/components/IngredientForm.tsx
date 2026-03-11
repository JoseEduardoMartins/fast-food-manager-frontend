/**
 * IngredientForm Component
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, Label } from '@components';
import type { Ingredient } from '@services/ingredients';
import type { IngredientFormData } from '../schemas';

interface IngredientFormProps {
  mode: 'create' | 'view' | 'edit';
  ingredient?: Ingredient;
}

export const IngredientForm: React.FC<IngredientFormProps> = ({ mode, ingredient }) => {
  const isViewOnly = mode === 'view';
  const { register, formState: { errors } } = useFormContext<IngredientFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Nome do ingrediente"
          required={!isViewOnly}
          {...register('name')}
          error={!!errors.name}
          errorText={errors.name?.message}
          placeholder="Ex: Carne bovina"
          disabled={isViewOnly}
        />
        {mode === 'create' ? (
          <div>
            <Label className="mb-2 block">Status</Label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('isActive')}
                className="rounded border-input"
              />
              <span>Ingrediente ativo</span>
            </label>
          </div>
        ) : mode === 'view' && ingredient ? (
          <div>
            <Label className="mb-2 block">Status</Label>
            <p className="py-2">{ingredient.isActive ? 'Ativo' : 'Inativo'}</p>
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
              <span>Ingrediente ativo</span>
            </label>
          </div>
        ) : null}
      </div>

      <div>
        <FormField
          label="Descrição"
          {...register('description')}
          error={!!errors.description}
          errorText={errors.description?.message}
          placeholder="Descrição opcional do ingrediente"
          disabled={isViewOnly}
        />
      </div>
    </div>
  );
};
