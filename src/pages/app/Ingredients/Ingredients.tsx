/**
 * Ingredients page
 * Manage ingredients
 */

import React from 'react';
import { AppLayout, PageHeader } from '@components';
import { useAuth } from '@contexts';

const Ingredients: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title="Ingredientes"
        description="Gerencie os ingredientes utilizados"
      />
    </AppLayout>
  );
};

export default Ingredients;
