/**
 * Profile Page
 * View and edit the logged-in user's profile (name, email, password, addresses)
 */

import React from 'react';
import { FormProvider, useFormContext } from 'react-hook-form';
import { Edit, Save, X, Lock } from 'lucide-react';
import {
  AppLayout,
  PageHeader,
  ErrorAlert,
  Button,
  Icon,
  Card,
  FormField,
  Badge,
  Label,
  Select,
} from '@components';
import { useAuth } from '@contexts';
import { AddressManager } from '../Users/components/AddressManager';
import { UserInfoSubHeader } from '../Users/components/UserInfoSubHeader';
import { useProfile } from './useProfile';
import type { ProfileFormData } from '../Users/schemas';
import type { Role } from '@services/roles';

interface ProfileFormViewProps {
  roles: Role[];
}

function ProfileFormView({ roles }: ProfileFormViewProps) {
  const { watch } = useFormContext<ProfileFormData>();
  const name = watch('name');
  const email = watch('email');
  const roleId = watch('roleId');
  const selectedRole = roles.find((r) => r.id === roleId);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Nome" value={name} readOnly />
        <FormField label="Email" value={email} readOnly />
      </div>
      {selectedRole && (
        <div>
          <Label className="mb-2 block">Perfil de Acesso</Label>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant={selectedRole.isSystem ? 'secondary' : 'default'} className="text-base py-1 px-3">
              {selectedRole.name}
            </Badge>
            {selectedRole.isSystem && (
              <span className="flex items-center gap-1 text-xs text-gray-500" title="Perfil do sistema">
                <Icon icon={Lock} size={12} />
                Sistema
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ProfileFormEditProps {
  roles: Role[];
  rolesLoading: boolean;
}

function ProfileFormEdit({ roles, rolesLoading }: ProfileFormEditProps) {
  const { register, formState: { errors } } = useFormContext<ProfileFormData>();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Nome Completo"
          required
          {...register('name')}
          error={!!errors.name}
          errorText={errors.name?.message}
          placeholder="Digite o nome completo"
        />
        <FormField
          label="Email"
          type="email"
          required
          {...register('email')}
          error={!!errors.email}
          errorText={errors.email?.message}
          placeholder="exemplo@email.com"
        />
        <FormField
          label="Nova senha (deixe em branco para não alterar)"
          type="password"
          {...register('password')}
          error={!!errors.password}
          errorText={errors.password?.message}
          placeholder="Mínimo 6 caracteres"
        />
        <FormField
          label="Confirmar nova senha"
          type="password"
          {...register('confirmPassword')}
          error={!!errors.confirmPassword}
          errorText={errors.confirmPassword?.message}
          placeholder="Repita a senha"
        />
      </div>
      
      {/* Perfil de Acesso */}
      <div>
        <Label className="mb-2 block">
          Perfil de Acesso
          <span className="text-error ml-1">*</span>
        </Label>
        <Select
          required
          {...register('roleId')}
          error={!!errors.roleId}
          disabled={rolesLoading}
        >
          <option value="">
            {rolesLoading ? 'Carregando perfis...' : 'Selecione um perfil'}
          </option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
              {role.isSystem ? ' (Sistema)' : ''}
            </option>
          ))}
        </Select>
        {errors.roleId && <p className="text-sm text-error mt-1">{errors.roleId?.message}</p>}
        {rolesLoading && <p className="text-sm text-gray-500 mt-1">Carregando perfis disponíveis...</p>}
      </div>
    </div>
  );
}

const Profile: React.FC = () => {
  const { user: currentUser, signOut } = useAuth();
  const {
    profile,
    loading,
    saving,
    error,
    setError,
    form,
    addresses,
    handleAddressesChange,
    isEditing,
    setIsEditing,
    onSubmit,
    reloadProfile,
    roles,
    rolesLoading,
  } = useProfile(currentUser?.id);

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <AppLayout user={currentUser} onSignOut={signOut}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600 dark:text-gray-400">Carregando perfil...</div>
        </div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout user={currentUser} onSignOut={signOut}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Não foi possível carregar seu perfil.</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Tentar novamente
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={currentUser} onSignOut={signOut}>
      <PageHeader
        title="Meu Perfil"
        description="Suas informações e endereços"
        action={
          !isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Icon icon={Edit} size={16} className="mr-2" />
              Editar perfil
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>
                <Icon icon={X} size={16} className="mr-2" />
                Cancelar
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} disabled={saving}>
                <Icon icon={Save} size={16} className="mr-2" />
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          )
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      {profile && <UserInfoSubHeader user={profile} />}

      <Card className="p-6">
        <FormProvider {...form}>
          {isEditing ? (
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ProfileFormEdit roles={roles} rolesLoading={rolesLoading} />
              <div className="mt-8">
                <AddressManager
                  mode="edit"
                  addresses={addresses}
                  userId={profile.id}
                  onAddressChange={reloadProfile}
                  onAddressesChange={handleAddressesChange}
                />
              </div>
            </form>
          ) : (
            <>
              <ProfileFormView roles={roles} />
              <div className="mt-8">
                <AddressManager
                  mode="view"
                  addresses={profile.userAddresses ?? []}
                  userId={profile.id}
                  onAddressChange={reloadProfile}
                />
              </div>
            </>
          )}
        </FormProvider>
      </Card>
    </AppLayout>
  );
};

export default Profile;
