/**
 * UserInfoSubHeader Component
 * Shows user metadata (status, verified, dates, companies, branches) below page header
 */

import React from 'react';
import { Badge } from '@components';
import type { User, UserCompany, UserBranch, LinkType } from '@services/users';

const linkTypeLabel: Record<LinkType, string> = {
  owner: 'Proprietário',
  employee: 'Empregado',
};

interface UserInfoSubHeaderProps {
  user: User;
}

export const UserInfoSubHeader: React.FC<UserInfoSubHeaderProps> = ({ user }) => {
  const userCompanies = user.userCompanies ?? [];
  const userBranches = user.userBranches ?? [];

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
      {userCompanies.length > 0 && (
        <div className="w-full">
          <span className="text-gray-600 dark:text-gray-400 mr-2">Empresas:</span>
          <span className="font-medium">
            {userCompanies
              .map((uc: UserCompany) => `${uc.company?.name ?? uc.companyId} (${linkTypeLabel[uc.linkType]})`)
              .join(', ')}
          </span>
        </div>
      )}
      {userBranches.length > 0 && (
        <div className="w-full">
          <span className="text-gray-600 dark:text-gray-400 mr-2">Filiais:</span>
          <span className="font-medium">
            {userBranches
              .map((ub: UserBranch) => {
                const label = ub.branch?.name ?? ub.branchId;
                const nickname = ub.branch?.nickname;
                const display = nickname ? `${label} (${nickname})` : label;
                return `${display} - ${linkTypeLabel[ub.linkType]}`;
              })
              .join(', ')}
          </span>
        </div>
      )}
    </div>
  );
};
