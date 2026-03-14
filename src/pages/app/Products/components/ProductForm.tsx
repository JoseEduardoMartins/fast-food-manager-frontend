/**
 * ProductForm Component
 * Price in reais in form; API uses centavos
 */

import React from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { FormField, Label, AsyncSelect, Button, Icon } from '@components';
import { Plus, Trash2 } from 'lucide-react';
import { listIngredients } from '@services/ingredients';
import type { Ingredient } from '@services/ingredients';
import type { ListIngredientsParams } from '@services/ingredients';
import type { Product } from '@services/products';
import type { ProductFormData } from '../schemas';

interface ProductFormProps {
  mode: 'create' | 'view' | 'edit';
  product?: Product;
}

const loadIngredientsOptions = async (): Promise<Ingredient[]> => {
  const res = await listIngredients({ pageSize: 500 });
  return res.data;
};

export const ProductForm: React.FC<ProductFormProps> = ({ mode, product }) => {
  const isViewOnly = mode === 'view';
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const ingredients = product?.ingredients ?? [];

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

      {/* Ingredientes */}
      <div>
        <Label className="mb-2 block">Ingredientes (receita)</Label>
        {isViewOnly ? (
          ingredients.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              Nenhum ingrediente cadastrado.
            </p>
          ) : (
            <ul className="space-y-2">
              {ingredients.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50 text-sm"
                >
                  <span className="font-medium">
                    {item.ingredient?.name ?? `Ingrediente #${item.ingredientId}`}
                  </span>
                  <span className="text-muted-foreground">
                    {item.units} un × {item.quantityPerUnit}{' '}
                    {item.ingredient?.unit ?? 'g'}
                  </span>
                </li>
              ))}
            </ul>
          )
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-wrap items-end gap-4 p-4 rounded-lg border border-input bg-muted/30"
              >
                <div className="flex-1 min-w-[200px]">
                  <Controller
                    control={control}
                    name={`ingredients.${index}.ingredientId`}
                    render={({ field: f }) => (
                      <AsyncSelect<Ingredient, ListIngredientsParams>
                        label="Ingrediente"
                        loadOptions={loadIngredientsOptions}
                        getLabel={(i) => i.name}
                        getValue={(i) => i.id}
                        value={f.value && f.value >= 1 ? String(f.value) : ''}
                        onChange={(e) =>
                          f.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        placeholder="Selecione o ingrediente"
                        error={!!errors.ingredients?.[index]?.ingredientId}
                        helperText={
                          errors.ingredients?.[index]?.ingredientId?.message
                        }
                      />
                    )}
                  />
                </div>
                <div className="w-24">
                  <FormField
                    label="Unidades"
                    type="number"
                    min={1}
                    {...register(`ingredients.${index}.units`)}
                    error={!!errors.ingredients?.[index]?.units}
                    errorText={errors.ingredients?.[index]?.units?.message}
                  />
                </div>
                <div className="w-32">
                  <FormField
                    label="Qtd/un (g/ml)"
                    type="number"
                    min={1}
                    {...register(`ingredients.${index}.quantityPerUnit`)}
                    error={!!errors.ingredients?.[index]?.quantityPerUnit}
                    errorText={
                      errors.ingredients?.[index]?.quantityPerUnit?.message
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                  className="shrink-0"
                >
                  <Icon icon={Trash2} size={16} />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  ingredientId: 0,
                  units: 1,
                  quantityPerUnit: 1,
                })
              }
            >
              <Icon icon={Plus} size={16} className="mr-2" />
              Adicionar ingrediente
            </Button>
          </div>
        )}
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
