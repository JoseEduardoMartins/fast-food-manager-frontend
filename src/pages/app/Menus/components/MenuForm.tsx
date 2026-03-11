/**
 * MenuForm Component
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, Label } from '@components';
import type { Menu } from '@services/menus';
import type { MenuFormData } from '../schemas';

interface MenuFormProps {
  mode: 'create' | 'view' | 'edit';
  menu?: Menu;
}

export const MenuForm: React.FC<MenuFormProps> = ({ mode, menu }) => {
  const isViewOnly = mode === 'view';
  const {
    register,
    formState: { errors },
  } = useFormContext<MenuFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Nome do menu"
          required={!isViewOnly}
          {...register('name')}
          error={!!errors.name}
          errorText={errors.name?.message}
          placeholder="Ex: Menu Principal"
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
              <span>Menu ativo</span>
            </label>
          </div>
        ) : mode === 'view' && menu ? (
          <div>
            <Label className="mb-2 block">Status</Label>
            <p className="py-2">{menu.isActive ? 'Ativo' : 'Inativo'}</p>
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
              <span>Menu ativo</span>
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
};
