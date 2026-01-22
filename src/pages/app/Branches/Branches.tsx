/**
 * Branches page
 * Manage branches
 */

import React from 'react';
import { AppLayout, PageHeader } from '@components';
import { useAuth } from '@contexts';

const Branches: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title="Filiais"
        description="Gerencie as filiais das empresas"
      />
    </AppLayout>
  );
};

export default Branches;
