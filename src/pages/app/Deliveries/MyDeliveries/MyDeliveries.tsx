/**
 * MyDeliveries Page
 * Tela para entregadores visualizarem e gerenciarem suas entregas
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, CheckCircle, XCircle, Play } from 'lucide-react';
import {
  AppLayout,
  PageHeader,
  ErrorAlert,
  Card,
  Button,
  Icon,
  Badge,
} from '@components';
import { useAuth } from '@contexts';
import type { OrderDelivery } from '@services/order-deliveries';
import { ROUTES } from '@common/constants';
import { ORDER_DELIVERY_STATUS_LABELS } from '@common/constants/orderEnums';
import { formatCurrency } from '@common/helpers';
import { useMyDeliveries } from './useMyDeliveries';

const MyDeliveries: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, signOut } = useAuth();
  const { deliveries, loading, error, setError, updating, startDelivery, completeDelivery, failDelivery } =
    useMyDeliveries(currentUser?.id);

  if (loading) {
    return (
      <AppLayout user={currentUser} onSignOut={signOut}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600 dark:text-gray-400">Carregando entregas...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={currentUser} onSignOut={signOut}>
      <PageHeader title="Minhas Entregas" description="Gerencie suas entregas ativas" />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      {deliveries.length === 0 ? (
        <Card className="p-8 text-center">
          <Icon icon={Truck} size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">Nenhuma entrega ativa no momento</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deliveries.map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onStart={() => startDelivery(delivery.id)}
              onComplete={() => {
                const note = prompt('Observação da entrega (opcional):');
                completeDelivery(delivery.id, note || undefined);
              }}
              onFail={() => {
                const note = prompt('Motivo da falha na entrega:');
                if (note) {
                  failDelivery(delivery.id, note);
                }
              }}
              onViewOrder={() => navigate(`${ROUTES.ORDERS}/${delivery.orderId}`)}
              isUpdating={updating === delivery.id}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
};

interface DeliveryCardProps {
  delivery: OrderDelivery;
  onStart: () => void;
  onComplete: () => void;
  onFail: () => void;
  onViewOrder: () => void;
  isUpdating: boolean;
}

function DeliveryCard({
  delivery,
  onStart,
  onComplete,
  onFail,
  onViewOrder,
  isUpdating,
}: DeliveryCardProps) {
  const order = delivery.order;
  const addr = order?.deliveryAddress;

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="font-mono text-xs text-gray-500">
            Pedido #{order?.id.slice(0, 8)}
          </span>
          <div className="font-semibold text-lg">
            {order ? formatCurrency(order.total) : 'R$ 0,00'}
          </div>
        </div>
        <Badge variant="secondary">{ORDER_DELIVERY_STATUS_LABELS[delivery.status]}</Badge>
      </div>

      {order?.client && (
        <div className="text-sm">
          <span className="text-gray-500">Cliente: </span>
          <span className="font-medium">{order.client.name}</span>
        </div>
      )}

      {addr && (
        <div className="text-sm space-y-1">
          <div className="flex items-start gap-2">
            <Icon icon={MapPin} size={14} className="mt-0.5 text-gray-500" />
            <div>
              <div>{addr.street}{addr.number ? ', ' + addr.number : ''}</div>
              {addr.complement && <div className="text-gray-500">{addr.complement}</div>}
              {addr.city && addr.state && (
                <div className="text-gray-500">
                  {addr.city.name} - {addr.state.shortName}
                </div>
              )}
              {addr.zipcode && <div className="text-gray-500">CEP: {addr.zipcode}</div>}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 pt-2">
        {delivery.status === 'assigned' && (
          <Button
            variant="default"
            size="sm"
            onClick={onStart}
            disabled={isUpdating}
            className="w-full"
          >
            <Icon icon={Play} size={14} className="mr-2" />
            {isUpdating ? 'Iniciando...' : 'Iniciar Entrega'}
          </Button>
        )}

        {delivery.status === 'in_transit' && (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={onComplete}
              disabled={isUpdating}
              className="w-full"
            >
              <Icon icon={CheckCircle} size={14} className="mr-2" />
              {isUpdating ? 'Confirmando...' : 'Confirmar Entrega'}
            </Button>
            <Button
              variant="error"
              size="sm"
              onClick={onFail}
              disabled={isUpdating}
              className="w-full"
            >
              <Icon icon={XCircle} size={14} className="mr-2" />
              Marcar como Falha
            </Button>
          </>
        )}

        <Button variant="outline" size="sm" onClick={onViewOrder} className="w-full">
          Ver Detalhes do Pedido
        </Button>
      </div>
    </Card>
  );
}

export default MyDeliveries;
