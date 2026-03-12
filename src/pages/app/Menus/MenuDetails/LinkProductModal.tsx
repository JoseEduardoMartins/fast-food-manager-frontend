/**
 * LinkProductModal - pick an existing product to link to the current menu
 */

import React, { useState } from 'react';
import { Modal, Button, AsyncSelect } from '@components';
import { formatCurrency } from '@common/helpers';
import { listProducts } from '@services/products';
import type { Product } from '@services/products';
import type { ListProductsParams } from '@services/products';

interface LinkProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingProductIds: string[];
  onLink: (productId: string) => Promise<void>;
  title?: string;
}

export const LinkProductModal: React.FC<LinkProductModalProps> = ({
  isOpen,
  onClose,
  existingProductIds,
  onLink,
  title = 'Vincular produto existente',
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [linking, setLinking] = useState(false);

  const loadProducts = async (params?: ListProductsParams) => {
    const res = await listProducts({
      pageSize: 200,
      sort: { fields: ['name'], order: ['ASC'] },
      ...params,
    });
    return res.data.filter((p) => !existingProductIds.includes(p.id));
  };

  const handleLink = async () => {
    if (!selectedProductId) return;
    setLinking(true);
    try {
      await onLink(selectedProductId);
      setSelectedProductId('');
      onClose();
    } finally {
      setLinking(false);
    }
  };

  const handleClose = () => {
    if (!linking) {
      setSelectedProductId('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size="md"
    >
      <div className="space-y-4">
        <AsyncSelect<Product, ListProductsParams>
          label="Produto"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          loadOptions={loadProducts}
          getValue={(p) => p.id}
          getLabel={(p) => `${p.name} – ${formatCurrency(p.price)}`}
          placeholder="Buscar e selecionar um produto..."
          reloadOnParamsChange={false}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleClose} disabled={linking}>
            Cancelar
          </Button>
          <Button
            onClick={handleLink}
            disabled={!selectedProductId || linking}
          >
            {linking ? 'Vinculando...' : 'Vincular'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
