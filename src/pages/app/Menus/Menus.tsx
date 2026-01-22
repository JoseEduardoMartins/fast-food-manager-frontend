/**
 * Menus page
 * Manage menus
 */

import React from 'react';
import { AppLayout, PageHeader } from '@components';
import { useAuth } from '@contexts';

const Menus: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title="Menus"
        description="Gerencie os menus e cardápios"
      />
    </AppLayout>
  );
};

export default Menus;
