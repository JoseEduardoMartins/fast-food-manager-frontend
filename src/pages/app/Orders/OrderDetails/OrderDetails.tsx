/**
 * OrderDetails Page
 * View order, items, delivery; actions: edit, delete
 */

import React from 'react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
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
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  CONSUMPTION_MODE_LABELS,
  ORDER_DELIVERY_STATUS_LABELS,
} from '@common/constants/orderEnums';
import { formatCurrency } from '@common/helpers';
import { useOrderDetails } from './useOrderDetails';

const OrderDetails: React.FC = () => {
  const { user, signOut } = useAuth();
  const {
    order,
    items,
    delivery,
    loading,
    error,
    setError,
    handleDelete,
    handleEdit,
    handleBack,
  } = useOrderDetails();

  if (loading) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Carregando..." />
        <Card className="p-6">Carregando pedido...</Card>
      </AppLayout>
    );
  }

  if (!order) {
    return (
      <AppLayout user={user} onSignOut={signOut}>
        <PageHeader title="Pedido não encontrado" />
        <Card className="p-6">
          <p>Pedido não encontrado.</p>
          <Button onClick={handleBack} className="mt-4">
            <Icon icon={ArrowLeft} size={16} className="mr-2" />
            Voltar
          </Button>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <PageHeader
        title={`Pedido #${order.id.slice(0, 8)}`}
        description="Detalhes do pedido"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack}>
              <Icon icon={ArrowLeft} size={16} className="mr-2" />
              Voltar
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Dados do pedido</h3>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <Badge variant="default">{ORDER_STATUS_LABELS[order.status]}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Total</dt>
              <dd>{formatCurrency(order.total)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pagamento</dt>
              <dd>
                {order.paymentMethod
                  ? PAYMENT_METHOD_LABELS[order.paymentMethod]
                  : '-'}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Modo de consumo</dt>
              <dd>{CONSUMPTION_MODE_LABELS[order.consumptionMode]}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Criado em</dt>
              <dd>{new Date(order.createdAt).toLocaleString('pt-BR')}</dd>
            </div>
          </dl>
        </Card>

        {delivery && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Entrega</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <Badge variant="default">
                    {ORDER_DELIVERY_STATUS_LABELS[delivery.status]}
                  </Badge>
                </dd>
              </div>
              {delivery.note && (
                <div>
                  <dt className="text-muted-foreground">Observação</dt>
                  <dd>{delivery.note}</dd>
                </div>
              )}
            </dl>
          </Card>
        )}
      </div>

      <Card className="p-6 mt-6">
        <h3 className="font-semibold mb-4">Itens do pedido</h3>
        {items.length === 0 ? (
          <p className="text-muted-foreground">Nenhum item.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between py-2 border-b border-border last:border-0"
              >
                <span>
                  {item.quantity}x Produto {item.productId.slice(0, 8)}…
                  {item.note ? ` (${item.note})` : ''}
                </span>
                <span>
                  {formatCurrency(item.unitPrice)} un. → {formatCurrency(item.quantity * item.unitPrice)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AppLayout>
  );
};

export default OrderDetails;
