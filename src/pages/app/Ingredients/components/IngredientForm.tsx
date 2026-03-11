/**
 * IngredientForm Component
 * Fields: name, description, unit (no status)
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, Label, Select } from '@components';
import type { Ingredient } from '@services/ingredients';
import type { IngredientFormData } from '../schemas';

const UNIT_OPTIONS: { value: Ingredient['unit']; label: string }[] = [
  { value: 'g', label: 'Gramas (g)' },
  { value: 'kg', label: 'Quilogramas (kg)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'L', label: 'Litros (L)' },
  { value: 'un', label: 'Unidade (un)' },
];

interface IngredientFormProps {
  mode: 'create' | 'view' | 'edit';
  ingredient?: Ingredient;
}

export const IngredientForm: React.FC<IngredientFormProps> = ({ mode, ingredient }) => {
  const isViewOnly = mode === 'view';
  const { register, formState: { errors }, setValue, watch } = useFormContext<IngredientFormData>();

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
        {isViewOnly && ingredient ? (
          <div>
            <Label className="mb-2 block">Unidade</Label>
            <p className="py-2">
              {UNIT_OPTIONS.find((o) => o.value === ingredient.unit)?.label ?? ingredient.unit}
            </p>
          </div>
        ) : (
          <div>
            <Label className="mb-2 block">Unidade</Label>
            <Select
              value={watch('unit') ?? ''}
              onChange={(e) => setValue('unit', e.target.value as IngredientFormData['unit'])}
              disabled={isViewOnly}
            >
              <option value="">Selecione a unidade</option>
              {UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
            {errors.unit && (
              <p className="text-sm text-error mt-1">{errors.unit.message}</p>
            )}
          </div>
        )}
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
