/**
 * UserForm Component
 * Reusable form for create, view, and edit user pages
 * Uses React Hook Form context
 */

import { Badge, FormField, Label, Select } from '@components';
import type { UserRole } from '@services/users';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { UserFormData } from '../schemas';
import { AddressManager } from './AddressManager';
import { PlanCards } from './PlanCards';

interface UserFormProps {
  mode: 'create' | 'view' | 'edit';
}

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  owner: 'Proprietário',
  manager: 'Gerente',
  cook: 'Cozinheiro',
  attendant: 'Atendente',
  customer: 'Cliente',
  delivery: 'Entregador',
};

const allowedRoles: UserRole[] = ['owner', 'manager', 'cook', 'attendant', 'customer', 'delivery'];

export const UserForm: React.FC<UserFormProps> = ({ mode }) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<UserFormData>();

  const role = watch('role');
  const isOwner = role === 'owner';
  const isViewOnly = mode === 'view';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <FormField
          label="Nome Completo"
          required={!isViewOnly}
          {...register('name')}
          error={!!errors.name}
          errorText={errors.name?.message}
          placeholder="Digite o nome completo"
          disabled={isViewOnly}
        />

        {/* Email Field */}
        <FormField
          label="Email"
          type="email"
          required={!isViewOnly}
          {...register('email')}
          error={!!errors.email}
          errorText={errors.email?.message}
          placeholder="exemplo@email.com"
          disabled={isViewOnly}
        />

        {/* Password Fields - Always shown for create and edit, never for view */}
        {!isViewOnly && (
          <>
            <FormField
              label="Senha"
              type="password"
              required
              {...register('password')}
              error={!!errors.password}
              errorText={errors.password?.message}
              placeholder="Mínimo 6 caracteres"
              disabled={isViewOnly}
            />

            <FormField
              label="Confirmar Senha"
              type="password"
              required
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              errorText={errors.confirmPassword?.message}
              placeholder="Digite a senha novamente"
              disabled={isViewOnly}
            />
          </>
        )}

        {/* Role Field - Full width */}
        <div className="md:col-span-2">
          <Label className="mb-2 block">
            Tipo de Usuário
            {!isViewOnly && <span className="text-error ml-1">*</span>}
          </Label>
          {isViewOnly ? (
            <div className="mt-1">
              <Badge variant="secondary" className="text-base py-1 px-3">
                {role}
              </Badge>
            </div>
          ) : (
            <>
              <Select
                required={!isViewOnly}
                {...register('role')}
                error={!!errors.role}
                disabled={isViewOnly}
              >
                <option value="">Selecione um tipo</option>
                {allowedRoles.map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role]}
                  </option>
                ))}
              </Select>
              {errors.role && <p className="text-sm text-error mt-1">{errors.role?.message}</p>}
            </>
          )}
        </div>
      </div>

      {/* Plan Cards - Show only for owner role */}
      {isOwner && <PlanCards disabled={isViewOnly} selectedPlan="preta" />}

      {/* Address Manager - Show in all modes */}
      <AddressManager mode={mode} />
    </div>
  );
};
