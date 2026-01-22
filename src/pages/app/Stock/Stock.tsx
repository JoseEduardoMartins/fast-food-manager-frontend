/**
 * Stock page
 * Manage stock/inventory
 */

import React from 'react';
import { AppLayout, PageHeader } from '@components';
import { useAuth } from '@contexts';

const Stock: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title="Estoque"
        description="Controle o estoque de produtos e ingredientes"
      />
    </AppLayout>
  );
};

export default Stock;
