/**
 * StockDetails Page - view branch-ingredient + recent transactions
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ArrowLeft, Edit, Trash2, ArrowDownUp } from 'lucide-react';
import {
  AppLayout,
  PageHeader,
  ErrorAlert,
  Button,
  Icon,
  Card,
  Badge,
} from '@components';
import { useAuth } from '@contexts';
import { StockForm } from '../components';
import { useStockDetails } from './useStockDetails';

const StockDetails: React.FC = () => {
  const { user, signOut } = useAuth();
  const {
    item,
    transactions,
    branchName,
    ingredientName,
    loading,
    error,
    setError,
    form,
    handleDelete,
    handleEdit,
    handleBack,
    handleNewMovement,
  } = useStockDetails();

  if (loading) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Carregando..." />
        <Card className="p-6">Carregando...</Card>
      </AppLayout>
    );
  }

  if (!item) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Não encontrado" />
        <Card className="p-6">
          <Button onClick={handleBack}>
            <Icon icon={ArrowLeft} size={16} className="mr-2" />
            Voltar
          </Button>
        </Card>
      </AppLayout>
    );
  }

  const lowStock = item.stockQuantity <= item.stockMinQuantity;

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title={`Estoque: ${ingredientName} — ${branchName}`}
        description="Detalhes e movimentações"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
            </Button>
            <Button variant="outline" onClick={handleNewMovement}>
              <Icon icon={ArrowDownUp} size={16} className="mr-2" />
              Nova movimentação
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Icon icon={Edit} size={16} className="mr-2" />
              Editar
            </Button>
            <Button variant="error" onClick={handleDelete}>
              <Icon icon={Trash2} size={16} className="mr-2" />
              Excluir
            </Button>
          </div>
        }
      />
      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />
      <Card className="p-6 mb-6">
        {lowStock && (
          <Badge variant="error" className="mb-4">
            Estoque abaixo do mínimo
          </Badge>
        )}
        <FormProvider {...form}>
          <StockForm mode="view" branchId={item.branchId} ingredientId={item.ingredientId} />
        </FormProvider>
      </Card>
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Últimas movimentações</h3>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma movimentação.</p>
        ) : (
          <ul className="space-y-2">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex justify-between py-2 border-b border-border last:border-0 text-sm"
              >
                <span>
                  <Badge variant={tx.type === 'input' ? 'success' : 'default'}>
                    {tx.type === 'input' ? 'Entrada' : 'Saída'}
                  </Badge>
                  {' '}
                  {tx.quantity} un.
                  {tx.description ? ` — ${tx.description}` : ''}
                </span>
                <span>
                  {tx.createdAt
                    ? new Date(tx.createdAt).toLocaleString('pt-BR')
                    : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AppLayout>
  );
};

export default StockDetails;
