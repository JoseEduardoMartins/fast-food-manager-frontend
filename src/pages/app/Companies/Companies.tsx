/**
 * Companies page
 * Manage companies
 */

import React from 'react';
import { AppLayout, PageHeader } from '@components';
import { useAuth } from '@contexts';

const Companies: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title="Empresas"
        description="Gerencie as empresas cadastradas no sistema"
      />
    </AppLayout>
  );
};

export default Companies;
