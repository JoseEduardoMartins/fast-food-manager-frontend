/**
 * useProductList Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { listProducts, deleteProduct } from '@services/products';
import type { Product, ListProductsParams } from '@services/products';

export const useProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 0,
    pageSize: 10,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: ListProductsParams = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sort: { fields: ['name'], order: ['ASC'] },
      };
      if (selectedStatus !== 'all') {
        params.isActive = selectedStatus === 'active';
      }
      if (searchName.trim()) {
        params.name = searchName.trim();
      }
      const response = await listProducts(params);
      setProducts(response.data);
      setPagination({
        total: response.total,
        pageIndex: response.pageIndex,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao carregar produtos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, selectedStatus, searchName]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (id: string, productName: string): Promise<void> => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o produto "${productName}"? Não é possível excluir um produto em uso (itens de pedido, etc.).`
    );
    if (!confirmed) return;
    try {
      await deleteProduct(id);
      toast.success('Produto excluído com sucesso!');
      await loadProducts();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number } };
      const msg = e.response?.data?.message ?? 'Erro ao excluir produto';
      if (e.response?.status === 409) {
        toast.error('Produto está em uso e não pode ser removido.');
      } else {
        toast.error(msg);
      }
      setError(msg);
    }
  };

  const handlePageChange = (newPageIndex: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleClearSearch = () => {
    setSearchName('');
    setSelectedStatus('all');
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return {
    products,
    loading,
    error,
    searchName,
    setSearchName,
    selectedStatus,
    setSelectedStatus,
    pagination,
    handleDelete,
    handlePageChange,
    handleSearch,
    handleClearSearch,
    setError,
    loadProducts,
  };
};
