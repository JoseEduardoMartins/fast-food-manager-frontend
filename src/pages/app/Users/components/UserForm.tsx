/**
 * UserForm Component
 * Reusable form for create, view, and edit user pages
 * Uses React Hook Form context
 */

import { Badge, FormField, Label, Select } from '@components';
import type { User, UserAddressInput } from '@services/users';
import type { Role } from '@services/roles';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { UserFormData } from '../schemas';
import { AddressManager } from './AddressManager';
import { PlanCards } from './PlanCards';

interface UserFormProps {
  mode: 'create' | 'view' | 'edit';
  user?: User | null;
  addresses?: UserAddressInput[];
  onAddressChange?: () => void;
  onAddressesChange?: (addresses: UserAddressInput[]) => void;
  roles?: Role[]; // Lista de perfis disponíveis
  rolesLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  mode,
  user,
  addresses = [],
  onAddressChange,
  onAddressesChange,
  roles = [],
  rolesLoading = false,
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<UserFormData>();

  const roleId = watch('roleId');
  const selectedRole = roles.find((r) => r.id === roleId);
  const isOwner = selectedRole?.code === 'owner';
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
            Perfil de Acesso
            {!isViewOnly && <span className="text-error ml-1">*</span>}
          </Label>
          {isViewOnly ? (
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={user?.roleData?.isSystem ? 'secondary' : 'default'} className="text-base py-1 px-3">
                {user?.roleData?.name || 'Sem perfil'}
              </Badge>
              {user?.roleData?.isSystem && (
                <span className="text-xs text-gray-500" title="Perfil do sistema">
                  🔒 Sistema
                </span>
              )}
            </div>
          ) : (
            <>
              <Select
                required={!isViewOnly}
                {...register('roleId')}
                error={!!errors.roleId}
                disabled={isViewOnly || rolesLoading}
              >
                <option value="">
                  {rolesLoading ? 'Carregando perfis...' : 'Selecione um perfil'}
                </option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                    {role.isSystem ? ' 🔒' : ''}
                  </option>
                ))}
              </Select>
              {errors.roleId && <p className="text-sm text-error mt-1">{errors.roleId?.message}</p>}
              {rolesLoading && <p className="text-sm text-gray-500 mt-1">Carregando perfis disponíveis...</p>}
            </>
          )}
        </div>
      </div>

      {/* Plan Cards - Show only for owner role */}
      {isOwner && <PlanCards disabled={isViewOnly} selectedPlan="preta" />}

      {/* Address Manager - Show in all modes */}
      <AddressManager
        mode={mode}
        addresses={mode === 'edit' ? addresses : user?.userAddresses}
        userId={user?.id}
        onAddressChange={onAddressChange}
        onAddressesChange={onAddressesChange}
      />
    </div>
  );
};
