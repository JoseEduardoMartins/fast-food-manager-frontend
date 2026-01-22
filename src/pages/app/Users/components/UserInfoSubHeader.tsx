/**
 * UserInfoSubHeader Component
 * Shows user metadata (status, verified, dates) below page header
 */

import React from 'react';
import { Badge } from '@components';
import type { User } from '@services/users';

interface UserInfoSubHeaderProps {
  user: User;
}

export const UserInfoSubHeader: React.FC<UserInfoSubHeaderProps> = ({ user }) => {
  return (
    <div className="mb-6 flex flex-wrap gap-6 text-sm">
      <div>
        <span className="text-gray-600 dark:text-gray-400 mr-2">Status:</span>
        <Badge variant={user.isActive ? 'success' : 'error'}>
          {user.isActive ? 'Ativo' : 'Inativo'}
        </Badge>
      </div>
      <div>
        <span className="text-gray-600 dark:text-gray-400 mr-2">Verificado:</span>
        <Badge variant={user.isVerified ? 'success' : 'warning'}>
          {user.isVerified ? 'Sim' : 'Não'}
        </Badge>
      </div>
      <div>
        <span className="text-gray-600 dark:text-gray-400">Data de Cadastro:</span>
        <span className="ml-2 font-medium">
          {new Date(user.createdAt).toLocaleString('pt-BR')}
        </span>
      </div>
      <div>
        <span className="text-gray-600 dark:text-gray-400">Última Atualização:</span>
        <span className="ml-2 font-medium">
          {new Date(user.updatedAt).toLocaleString('pt-BR')}
        </span>
      </div>
    </div>
  );
};
