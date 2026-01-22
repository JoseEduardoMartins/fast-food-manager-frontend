/**
 * UserForm Component
 * Reusable form for create, view, and edit user pages
 * Uses React Hook Form context
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, Label, Select, Badge } from '@components';
import type { User, UserRole } from '@services/users';
import type { UserFormData } from '../schemas';

interface UserFormProps {
  isViewOnly?: boolean;
  user?: User;
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

export const UserForm: React.FC<UserFormProps> = ({ isViewOnly = false, user, mode }) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<UserFormData>();

  const password = watch('password');
  const showConfirmPassword = mode === 'create' || (mode === 'edit' && password && password.length > 0);

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

        {/* Password Fields - Only for create and edit */}
        {!isViewOnly && (
          <>
            <FormField
              label={mode === 'create' ? 'Senha' : 'Nova Senha (opcional)'}
              type="password"
              required={mode === 'create'}
              {...register('password')}
              error={!!errors.password}
              errorText={errors.password?.message}
              placeholder={mode === 'create' ? 'Mínimo 6 caracteres' : 'Deixe em branco para manter a senha atual'}
              helperText={mode === 'edit' ? 'Deixe em branco se não quiser alterar a senha' : undefined}
              disabled={isViewOnly}
            />

            {showConfirmPassword && (
              <FormField
                label={mode === 'create' ? 'Confirmar Senha' : 'Confirmar Nova Senha'}
                type="password"
                required={mode === 'create'}
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                errorText={errors.confirmPassword?.message}
                placeholder="Digite a senha novamente"
                disabled={isViewOnly}
              />
            )}
          </>
        )}

        {/* Role Field */}
        <div>
          <Label className="mb-2 block">
            Tipo de Usuário
            {!isViewOnly && <span className="text-error ml-1">*</span>}
          </Label>
          {isViewOnly && user ? (
            <div className="mt-1">
              <Badge variant="secondary">{roleLabels[user.role]}</Badge>
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
              {errors.role && (
                <p className="text-sm text-error mt-1">{errors.role?.message}</p>
              )}
            </>
          )}
        </div>

        {/* Status Field */}
        {!isViewOnly && (
          <div>
            <Label className="mb-2 block">Status</Label>
            <Select
              {...register('isActive', { 
                setValueAs: (v) => v === 'true' || v === true 
              })}
              disabled={isViewOnly}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </Select>
          </div>
        )}

        {/* View-only fields */}
        {isViewOnly && user && (
          <>
            <div>
              <Label className="text-sm text-gray-600 dark:text-gray-400">ID do Usuário</Label>
              <p className="font-medium mt-1">{user.id}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600 dark:text-gray-400">Status</Label>
              <div className="mt-1">
                <Badge variant={user.isActive ? 'success' : 'error'}>
                  {user.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-600 dark:text-gray-400">Verificado</Label>
              <div className="mt-1">
                <Badge variant={user.isVerified ? 'success' : 'warning'}>
                  {user.isVerified ? 'Sim' : 'Não'}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-600 dark:text-gray-400">Data de Cadastro</Label>
              <p className="font-medium mt-1">
                {new Date(user.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>
            <div>
              <Label className="text-sm text-gray-600 dark:text-gray-400">Última Atualização</Label>
              <p className="font-medium mt-1">
                {new Date(user.updatedAt).toLocaleString('pt-BR')}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
