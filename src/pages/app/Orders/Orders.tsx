/**
 * Orders page
 * Manage orders
 */

import React from 'react';
import { AppLayout, PageHeader } from '@components';
import { useAuth } from '@contexts';

const Orders: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title="Pedidos"
        description="Visualize e gerencie os pedidos"
      />
    </AppLayout>
  );
};

export default Orders;
