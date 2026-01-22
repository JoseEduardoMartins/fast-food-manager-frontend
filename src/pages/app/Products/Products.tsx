/**
 * Products page
 * Manage products
 */

import React from 'react';
import { AppLayout, PageHeader } from '@components';
import { useAuth } from '@contexts';

const Products: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title="Produtos"
        description="Gerencie os produtos disponíveis"
      />
    </AppLayout>
  );
};

export default Products;
