# Otimizações e reutilização – Fast Food Manager Frontend

## Já implementado

### 1. **`formatCurrency` (centavos → R$)**
- **Onde:** `@common/helpers` (`formatCurrency.ts`)
- **Uso:** Substitui formatação duplicada de preços em centavos para "R$ X,XX".
- **Arquivos que passaram a usar:** OrderKanban, OrderList, OrderDetails, ProductList, StockList, LinkProductModal.

### 2. **Hook `useBranches`**
- **Onde:** `@common/hooks` (`useBranches.ts`)
- **Retorno:** `{ branches, getBranchName, reloadBranches }`.
- **Uso:** Centraliza carregamento de filiais e resolução de nome por ID.
- **Arquivos que passaram a usar:** OrderKanban, OrderList, useStockList (StockList).

---

## Oportunidades futuras

### Componentes
- **AddressSelector:** Companies e Branches têm um `AddressSelector` cada (país/estado/cidade e endereço). Dá para extrair um hook `useAddressLocation` (loadCountries, loadStates, loadCities) e um componente compartilhado de País/Estado/Cidade, com cada módulo passando o que for específico (form context ou callback).

### Hooks
- **Padrão List (CRUD):** useMenuList, useProductList, useCategoryList, useIngredientList (e outros) repetem: loading, pagination, filters, load, handleDelete, handlePageChange, handleSearch, handleClearSearch. Um hook genérico `useCrudList<T>(config)` poderia receber service (list, delete), defaultSort, filterKeys e retornar o mesmo contrato, reduzindo duplicação.
- **useConfirm:** Vários `window.confirm` antes de delete/cancel. Um hook `useConfirm(message, onConfirm)` ou um componente `ConfirmModal` reutilizável padronizaria mensagens e comportamento.

### Utilitários
- **Tratamento de erro de API:** Vários `catch` fazem `(err as { response?: { data?: { message?: string } } })` e `e.response?.data?.message ?? 'Erro...'`. Uma função `getApiErrorMessage(err, defaultMessage)` em `@common/helpers` unificaria isso.

---

## Como usar os helpers/hooks atuais

```ts
import { formatCurrency } from '@common/helpers';
import { useBranches } from '@common/hooks';

// Formatar preço
formatCurrency(1990); // "R$ 19,90"

// Filiais
const { branches, getBranchName } = useBranches();
getBranchName(branchId); // nome ou id truncado
```
