/**
 * OrderForm Component
 * Form for create and edit order (branch, mode, client, delivery address, payment, items)
 */

import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import {
  FormField,
  Label,
  Select,
  Button,
  Icon,
  AsyncSelect,
  Input,
} from '@components';
import type { OrderFormData } from '../schemas';
import type { Branch } from '@services/branches';
import type { User } from '@services/users';
import type { Product } from '@services/products';
import { listBranches } from '@services/branches';
import { listUsers } from '@services/users';
import { getUserById } from '@services/users';
import { listProducts } from '@services/products';
import type { ListBranchesParams } from '@services/branches';
import type { ListUsersParams } from '@services/users';
import type { ListProductsParams } from '@services/products';
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  CONSUMPTION_MODE_LABELS,
} from '@common/constants/orderEnums';
import { CONSUMPTION_MODE } from '@common/constants/orderEnums';
import type { UserAddress } from '@services/users';

interface OrderFormProps {
  isViewOnly?: boolean;
  branchId?: string;
  menuId?: string; // optional: filter products by menu
}

export const OrderForm: React.FC<OrderFormProps> = ({
  isViewOnly = false,
  branchId,
  menuId,
}) => {
  const { watch, setValue, register, formState: { errors } } = useFormContext<OrderFormData>();
  const consumptionMode = watch('consumptionMode');
  const clientId = watch('clientId');
  const items = watch('items') ?? [];
  const [clientAddresses, setClientAddresses] = useState<{ id: string; label: string }[]>([]);

  const isDelivery = consumptionMode === CONSUMPTION_MODE.delivery;

  useEffect(() => {
    if (!isDelivery || !clientId?.trim()) {
      setClientAddresses([]);
      setValue('deliveryAddressId', '');
      return;
    }
    getUserById(clientId)
      .then((user: User) => {
        const list: { id: string; label: string }[] = (user.userAddresses ?? []).map(
          (ua: UserAddress) => ({
            id: ua.addressId,
            label: ua.address
              ? `${ua.address.street}${ua.address.number ? `, ${ua.address.number}` : ''}`
              : ua.addressId,
          })
        );
        setClientAddresses(list);
        if (list.length === 1) setValue('deliveryAddressId', list[0].id);
        else setValue('deliveryAddressId', '');
      })
      .catch(() => setClientAddresses([]));
  }, [clientId, isDelivery, setValue]);

  const loadBranches = async (params?: ListBranchesParams): Promise<Branch[]> => {
    try {
      const res = await listBranches({ pageSize: 200, sort: { fields: ['name'], order: ['ASC'] }, ...params });
      return res.data;
    } catch {
      return [];
    }
  };

  const loadCustomers = async (params?: ListUsersParams): Promise<User[]> => {
    try {
      const res = await listUsers({ role: 'customer', pageSize: 200, ...params });
      return res.data;
    } catch {
      return [];
    }
  };

  const loadAttendants = async (params?: ListUsersParams): Promise<User[]> => {
    try {
      const res = await listUsers({ role: 'attendant', pageSize: 200, ...params });
      return res.data;
    } catch {
      return [];
    }
  };

  const loadProducts = async (params?: ListProductsParams): Promise<Product[]> => {
    try {
      const p: ListProductsParams = { pageSize: 200, sort: { fields: ['name'], order: ['ASC'] }, ...params };
      if (menuId) p.menuId = menuId;
      const res = await listProducts(p);
      return res.data;
    } catch {
      return [];
    }
  };

  const addItem = () => {
    setValue('items', [...items, { productId: '', quantity: 1, unitPrice: 0, note: '' }]);
  };

  const removeItem = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    setValue('items', next);
  };

  const totalReais = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  useEffect(() => {
    if (items.length > 0) {
      setValue('total', Math.round(totalReais * 100) / 100);
    }
  }, [totalReais, items.length, setValue]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <AsyncSelect<Branch, ListBranchesParams>
            label="Filial"
            value={watch('branchId') || branchId || ''}
            onChange={(e) => setValue('branchId', e.target.value)}
            loadOptions={loadBranches}
            getValue={(b) => b.id}
            getLabel={(b) => b.name}
            placeholder="Selecione a filial"
            loadingText="Carregando filiais..."
            noOptionsText="Nenhuma filial disponível"
            disabled={isViewOnly}
            reloadOnParamsChange={false}
          />
          {errors.branchId && (
            <p className="text-sm text-error mt-1">{errors.branchId.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-2 block">Modo de consumo</Label>
          <Select
            value={watch('consumptionMode')}
            onChange={(e) =>
              setValue('consumptionMode', e.target.value as OrderFormData['consumptionMode'])
            }
            disabled={isViewOnly}
          >
            {Object.entries(CONSUMPTION_MODE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Forma de pagamento</Label>
          <Select
            value={watch('paymentMethod') ?? ''}
            onChange={(e) =>
              setValue(
                'paymentMethod',
                (e.target.value || undefined) as OrderFormData['paymentMethod']
              )
            }
            disabled={isViewOnly}
          >
            <option value="">Selecione</option>
            {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Status</Label>
          <Select
            value={watch('status')}
            onChange={(e) => setValue('status', e.target.value as OrderFormData['status'])}
            disabled={isViewOnly}
          >
            {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        {!isViewOnly && (
          <>
            <div className="md:col-span-2">
              <AsyncSelect<User, ListUsersParams>
                label="Cliente (opcional)"
                value={watch('clientId') || ''}
                onChange={(e) => setValue('clientId', e.target.value)}
                loadOptions={loadCustomers}
                getValue={(u) => u.id}
                getLabel={(u) => u.name}
                placeholder="Selecione o cliente"
                loadingText="Carregando clientes..."
                noOptionsText="Nenhum cliente encontrado"
                reloadOnParamsChange={false}
              />
            </div>

            {isDelivery && (
              <div className="md:col-span-2">
                <Label className="mb-2 block">Endereço de entrega *</Label>
                <Select
                  value={watch('deliveryAddressId') || ''}
                  onChange={(e) => setValue('deliveryAddressId', e.target.value)}
                  disabled={isViewOnly}
                >
                  <option value="">Selecione o endereço</option>
                  {clientAddresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </Select>
                {errors.deliveryAddressId && (
                  <p className="text-sm text-error mt-1">{errors.deliveryAddressId.message}</p>
                )}
              </div>
            )}

            <div className="md:col-span-2">
              <AsyncSelect<User, ListUsersParams>
                label="Atendente (opcional)"
                value={watch('attendantId') || ''}
                onChange={(e) => setValue('attendantId', e.target.value)}
                loadOptions={loadAttendants}
                getValue={(u) => u.id}
                getLabel={(u) => u.name}
                placeholder="Selecione o atendente"
                loadingText="Carregando atendentes..."
                noOptionsText="Nenhum atendente encontrado"
                reloadOnParamsChange={false}
              />
            </div>
          </>
        )}
      </div>

      {/* Total (read-only when items exist) */}
      <div>
        <Label className="mb-2 block">Total (R$)</Label>
        <Input
          type="number"
          step="0.01"
          min={0}
          {...register('total')}
          disabled={isViewOnly || items.length > 0}
        />
        {errors.total && (
          <p className="text-sm text-error mt-1">{errors.total.message}</p>
        )}
      </div>

      {/* Order items */}
      {!isViewOnly && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Itens do pedido</Label>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Icon icon={Plus} size={16} className="mr-2" />
              Adicionar item
            </Button>
          </div>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 border rounded-md bg-muted/30"
              >
                <div className="md:col-span-4">
                  <AsyncSelect<Product, ListProductsParams>
                    label="Produto"
                    value={item.productId}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...next[index], productId: e.target.value };
                      setValue('items', next);
                    }}
                    loadOptions={loadProducts}
                    getValue={(p) => p.id}
                    getLabel={(p) => p.name}
                    placeholder="Produto"
                    loadingText="Carregando..."
                    noOptionsText="Nenhum produto"
                    reloadOnParamsChange={false}
                  />
                </div>
                <div className="md:col-span-2">
                  <FormField
                    label="Qtd"
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...next[index], quantity: Number(e.target.value) || 1 };
                      setValue('items', next);
                    }}
                  />
                </div>
                <div className="md:col-span-2">
                  <FormField
                    label="Preço unit. (R$)"
                    type="number"
                    step="0.01"
                    min={0}
                    value={item.unitPrice}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...next[index], unitPrice: Number(e.target.value) || 0 };
                      setValue('items', next);
                    }}
                  />
                </div>
                <div className="md:col-span-3">
                  <FormField
                    label="Observação"
                    placeholder="Ex: sem cebola"
                    value={item.note ?? ''}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...next[index], note: e.target.value };
                      setValue('items', next);
                    }}
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <Button
                    type="button"
                    variant="error"
                    size="sm"
                    onClick={() => removeItem(index)}
                    title="Remover item"
                  >
                    <Icon icon={Trash2} size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
