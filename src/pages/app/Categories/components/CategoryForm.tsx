/**
 * CategoryForm Component
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, Label } from '@components';
import { AsyncSelect } from '@components';
import { listMenus } from '@services/menus';
import type { Menu } from '@services/menus';
import type { ListMenusParams } from '@services/menus';
import type { Category } from '@services/categories';
import type { CategoryFormData, CategoryEditFormData } from '../schemas';

interface CategoryFormProps {
  mode: 'create' | 'view' | 'edit';
  category?: Category;
  menuName?: string;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  mode,
  category,
  menuName,
}) => {
  const isViewOnly = mode === 'view';
  const formData = useFormContext<CategoryFormData | CategoryEditFormData>();
  const { register, formState: { errors }, setValue, watch } = formData;
  const isCreate = mode === 'create';

  const loadMenus = async (params?: ListMenusParams) => {
    const res = await listMenus({
      pageSize: 200,
      sort: { fields: ['name'], order: ['ASC'] },
      ...params,
    });
    return res.data;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isCreate && (
          <div>
            <AsyncSelect<Menu, ListMenusParams>
              label="Menu"
              loadOptions={loadMenus}
              getValue={(m) => m.id}
              getLabel={(m) => m.name}
              value={String(watch('menuId' as keyof CategoryFormData) ?? '')}
              onChange={(e) => setValue('menuId' as keyof CategoryFormData, e.target.value)}
              placeholder="Selecione o menu"
              reloadOnParamsChange={false}
              error={!!(errors as Record<string, { message?: string }>)?.menuId}
              helperText={(errors as Record<string, { message?: string }>)?.menuId?.message}
            />
          </div>
        )}
        {mode === 'view' && menuName != null && (
          <FormField
            label="Menu"
            value={menuName}
            disabled
          />
        )}
        <FormField
          label="Nome da categoria"
          required={!isViewOnly}
          {...register('name')}
          error={!!errors.name}
          errorText={errors.name?.message}
          placeholder="Ex: Lanches, Bebidas"
          disabled={isViewOnly}
        />
        <FormField
          label="Ordem"
          type="number"
          min={0}
          required={!isViewOnly}
          {...register('order')}
          error={!!errors.order}
          errorText={errors.order?.message}
          placeholder="0"
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
              <span>Categoria ativa</span>
            </label>
          </div>
        ) : mode === 'view' && category ? (
          <div>
            <Label className="mb-2 block">Status</Label>
            <p className="py-2">{category.isActive ? 'Ativa' : 'Inativa'}</p>
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
              <span>Categoria ativa</span>
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
};
