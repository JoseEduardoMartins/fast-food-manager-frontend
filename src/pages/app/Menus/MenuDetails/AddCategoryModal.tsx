/**
 * AddCategoryModal - add a category to the menu and optionally link one product
 */

import React, { useState } from 'react';
import { Modal, Button, FormField, AsyncSelect } from '@components';
import { listProducts } from '@services/products';
import type { Product } from '@services/products';
import type { ListProductsParams } from '@services/products';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, order: number, productId?: string) => Promise<void>;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [order, setOrder] = useState(0);
  const [productId, setProductId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadProducts = async (params?: ListProductsParams) => {
    const res = await listProducts({
      pageSize: 200,
      sort: { fields: ['name'], order: ['ASC'] },
      ...params,
    });
    return res.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(name.trim(), order, productId || undefined);
      setName('');
      setOrder(0);
      setProductId('');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setName('');
      setOrder(0);
      setProductId('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nova categoria"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Nome da categoria"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Lanches, Bebidas"
        />
        <FormField
          label="Ordem"
          type="number"
          min={0}
          value={String(order)}
          onChange={(e) => setOrder(Number(e.target.value) || 0)}
          placeholder="0"
        />
        <div>
          <AsyncSelect<Product, ListProductsParams>
            label="Vincular a um produto (opcional)"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            loadOptions={loadProducts}
            getValue={(p) => p.id}
            getLabel={(p) => p.name}
            placeholder="Selecione um produto para vincular..."
            reloadOnParamsChange={false}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!name.trim() || submitting}>
            {submitting ? 'Criando...' : 'Criar categoria'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
