# Documentação CRUD de Usuários - Frontend

Esta documentação descreve como integrar o CRUD (Create, Read, Update, Delete) de usuários do Fast Food Manager Backend no frontend.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Autenticação Necessária](#autenticação-necessária)
- [Endpoints Disponíveis](#endpoints-disponíveis)
- [Detalhamento dos Endpoints](#detalhamento-dos-endpoints)
- [Filtros e Paginação](#filtros-e-paginação)
- [Tratamento de Erros](#tratamento-de-erros)
- [Exemplos de Código](#exemplos-de-código)

---

## 🎯 Visão Geral

O CRUD de usuários permite:

- ✅ **Listar usuários** com filtros e paginação
- ✅ **Buscar usuário por ID** com seleção de campos
- ✅ **Criar novo usuário** (senha é hasheada automaticamente)
- ✅ **Atualizar usuário** existente
- ✅ **Deletar usuário** do sistema

**Importante:** Todos os endpoints requerem autenticação via token JWT.

**Nota:** Apenas usuários com role `admin` podem acessar esta funcionalidade.

---

## 🔐 Autenticação Necessária

Todos os endpoints de usuário **requerem autenticação**. O token JWT é adicionado automaticamente via interceptor do Axios no header:

```
token: <seu-jwt-token>
```

O token é obtido automaticamente dos cookies através do `http` instance configurado.

> ⚠️ **Nota**: Sem o token válido, você receberá `401 Unauthorized` e será redirecionado para o login.

---

## 📡 Endpoints Disponíveis

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `GET` | `/users` | Listar usuários | ✅ Sim |
| `GET` | `/users/:id` | Buscar usuário por ID | ✅ Sim |
| `POST` | `/users` | Criar novo usuário | ✅ Sim |
| `PATCH` | `/users/:id` | Atualizar usuário | ✅ Sim |
| `DELETE` | `/users/:id` | Deletar usuário | ✅ Sim |

**Base URL:** Configurada em `src/config/environment.ts` (padrão: `http://localhost:3000`)

---

## 📝 Detalhamento dos Endpoints

### 1. Listar Usuários

**Endpoint:** `GET /users`

**Query Parameters (Opcionais):**

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `pageIndex` | number | Índice da página (0-based) | `0` |
| `pageSize` | number | Itens por página | `10` |
| `name` | string | Filtro por nome (busca parcial) | `"João"` |
| `email` | string | Filtro por email (busca parcial) | `"joao@example.com"` |
| `role` | string | Filtro por papel | `"customer"` |
| `companyId` | string | Filtro por empresa (UUID) | `"123e4567-..."` |
| `branchId` | string | Filtro por filial (UUID) | `"123e4567-..."` |
| `isActive` | boolean | Filtro por status | `true` |
| `selectFields` | string[] | Campos a retornar | `["id", "name", "email"]` |

**Resposta de Sucesso (200 OK):**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "João Silva",
      "email": "joao@example.com",
      "role": "customer",
      "companyId": null,
      "branchId": null,
      "isActive": true,
      "isVerified": true,
      "isDeleted": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "pageIndex": 0,
  "pageSize": 10,
  "totalPages": 1
}
```

**Exemplo de Uso:**
```typescript
import { listUsers } from '@services/users';

// Listar todos os usuários
const response = await listUsers({
  pageIndex: 0,
  pageSize: 10
});

console.log('Usuários:', response.data);
console.log('Total:', response.total);
```

**Exemplo com Filtros:**
```typescript
// Filtrar por nome e role
const response = await listUsers({
  name: 'João',
  role: 'customer',
  pageIndex: 0,
  pageSize: 10
});
```

---

### 2. Buscar Usuário por ID

**Endpoint:** `GET /users/:id`

**Parâmetros:**
- `id` (path) - UUID do usuário

**Query Parameters (Opcionais):**
- `selectFields` (string[]) - Array de campos a retornar. Campos disponíveis: `id`, `name`, `email`, `role`, `companyId`, `branchId`, `isActive`, `isVerified`, `createdAt`, `updatedAt`

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "customer",
  "companyId": null,
  "branchId": null,
  "isActive": true,
  "isVerified": true,
  "isDeleted": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Erros Possíveis:**
- `401 Unauthorized` - Token inválido ou ausente
- `404 Not Found` - Usuário não encontrado

**Exemplo de Uso:**
```typescript
import { getUserById } from '@services/users';

const user = await getUserById('123e4567-e89b-12d3-a456-426614174000');
console.log('Usuário:', user);
```

**Exemplo com Seleção de Campos:**
```typescript
// Retornar apenas alguns campos
const user = await getUserById('123e4567-e89b-12d3-a456-426614174000', [
  'id',
  'name',
  'email',
  'role'
]);
```

---

### 3. Criar Usuário

**Endpoint:** `POST /users`

**Body (JSON):**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "customer",
  "companyId": "123e4567-e89b-12d3-a456-426614174000",
  "branchId": "123e4567-e89b-12d3-a456-426614174000",
  "isActive": true
}
```

**Campos:**
- `name` (string, obrigatório, 1-300 caracteres) - Nome do usuário
- `email` (string, obrigatório, válido, único) - Email do usuário
- `password` (string, obrigatório, 6-255 caracteres) - Senha (será hasheada automaticamente)
- `role` (enum, obrigatório) - Papel do usuário. Valores: `admin`, `owner`, `manager`, `cook`, `attendant`, `customer`, `delivery`
- `companyId` (string, opcional, UUID) - ID da empresa
- `branchId` (string, opcional, UUID) - ID da filial
- `isActive` (boolean, opcional, default: `true`) - Status ativo

**Resposta de Sucesso (201 Created):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Erros Possíveis:**
- `400 Bad Request` - Dados inválidos (validação)
- `401 Unauthorized` - Token inválido ou ausente
- `409 Conflict` - Email já está em uso

**Exemplo de Uso:**
```typescript
import { createUser } from '@services/users';

const response = await createUser({
  name: 'João Silva',
  email: 'joao@example.com',
  password: 'senha123',
  role: 'customer',
  isActive: true
});

console.log('Usuário criado:', response.id);
```

---

### 4. Atualizar Usuário

**Endpoint:** `PATCH /users/:id`

**Parâmetros:**
- `id` (path) - UUID do usuário

**Body (JSON):** Todos os campos são opcionais
```json
{
  "name": "João Silva Santos",
  "email": "joao.novo@example.com",
  "password": "novaSenha123",
  "role": "manager",
  "companyId": "123e4567-e89b-12d3-a456-426614174000",
  "branchId": "123e4567-e89b-12d3-a456-426614174000",
  "isActive": false
}
```

**Campos:**
- `name` (string, opcional, 1-300 caracteres) - Nome do usuário
- `email` (string, opcional, válido, único) - Email do usuário
- `password` (string, opcional, 6-255 caracteres) - Nova senha (será hasheada automaticamente)
- `role` (enum, opcional) - Papel do usuário
- `companyId` (string, opcional, UUID) - ID da empresa
- `branchId` (string, opcional, UUID) - ID da filial
- `isActive` (boolean, opcional) - Status ativo

**Resposta de Sucesso (204 No Content):** Sem corpo na resposta

**Erros Possíveis:**
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Token inválido ou ausente
- `404 Not Found` - Usuário não encontrado
- `409 Conflict` - Email já está em uso (se estiver atualizando para um email existente)

**Exemplo de Uso:**
```typescript
import { updateUser } from '@services/users';

await updateUser('123e4567-e89b-12d3-a456-426614174000', {
  name: 'João Silva Santos',
  isActive: false
});
```

---

### 5. Deletar Usuário

**Endpoint:** `DELETE /users/:id`

**Parâmetros:**
- `id` (path) - UUID do usuário

**Resposta de Sucesso (204 No Content):** Sem corpo na resposta

**Erros Possíveis:**
- `401 Unauthorized` - Token inválido ou ausente
- `404 Not Found` - Usuário não encontrado

**Exemplo de Uso:**
```typescript
import { deleteUser } from '@services/users';

await deleteUser('123e4567-e89b-12d3-a456-426614174000');
```

---

## 🔍 Filtros e Paginação

### Parâmetros de Paginação

```typescript
// Página 1 (índice 0), 20 itens por página
const response = await listUsers({
  pageIndex: 0,
  pageSize: 20
});
```

### Filtros Disponíveis

```typescript
const response = await listUsers({
  name: 'João',           // Filtro por nome (busca parcial)
  email: 'joao@',         // Filtro por email (busca parcial)
  role: 'customer',       // Filtro por papel
  companyId: '...',       // Filtro por empresa
  branchId: '...',        // Filtro por filial
  isActive: true          // Filtro por status
});
```

### Seleção de Campos

```typescript
// Retornar apenas campos específicos na listagem
const response = await listUsers({
  selectFields: ['id', 'name', 'email', 'role']
});
```

**Exemplo Completo:**
```typescript
const response = await listUsers({
  pageIndex: 0,
  pageSize: 10,
  role: 'customer',
  isActive: true
});

console.log('Usuários:', response.data);
console.log('Total:', response.total);
console.log('Páginas:', response.totalPages);
```

---

## ⚠️ Tratamento de Erros

### Códigos de Status HTTP

| Código | Significado | Ação Recomendada |
|--------|-------------|------------------|
| `200` | Sucesso | Processar resposta normalmente |
| `201` | Criado | Usuário criado com sucesso |
| `204` | No Content | Operação concluída (update/delete) |
| `400` | Bad Request | Validar dados enviados |
| `401` | Unauthorized | Token inválido ou ausente - redirecionar para login |
| `404` | Not Found | Usuário não encontrado |
| `409` | Conflict | Email já está em uso |

### Tratamento Automático

O serviço usa o `httpErrorHandler` que trata automaticamente:
- **401 Unauthorized**: Redireciona para `/login` se token inválido
- **400 Bad Request**: Log de erro no console
- **409 Conflict**: Email já está em uso
- **404 Not Found**: Recurso não encontrado

---

## 📦 Exemplos de Código

### Importar o Serviço

```typescript
import { listUsers, getUserById, createUser, updateUser, deleteUser } from '@services/users';
import type { User, CreateUserRequest, UpdateUserRequest, ListUsersParams } from '@services/users';
```

### Listar Usuários

```typescript
try {
  const response = await listUsers({
    pageIndex: 0,
    pageSize: 10,
    role: 'customer'
  });
  
  console.log('Usuários:', response.data);
  console.log('Total:', response.total);
} catch (error) {
  console.error('Erro ao carregar usuários:', error);
}
```

### Criar Usuário

```typescript
try {
  const response = await createUser({
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'senha123',
    role: 'customer',
    isActive: true
  });
  
  console.log('Usuário criado:', response.id);
} catch (error: any) {
  if (error.response?.status === 409) {
    alert('Email já está em uso');
  } else {
    console.error('Erro ao criar usuário:', error);
  }
}
```

### Atualizar Usuário

```typescript
try {
  await updateUser('123e4567-e89b-12d3-a456-426614174000', {
    name: 'João Silva Santos',
    isActive: false
  });
  
  console.log('Usuário atualizado com sucesso');
} catch (error: any) {
  if (error.response?.status === 404) {
    alert('Usuário não encontrado');
  } else if (error.response?.status === 409) {
    alert('Email já está em uso');
  } else {
    console.error('Erro ao atualizar usuário:', error);
  }
}
```

### Deletar Usuário

```typescript
try {
  await deleteUser('123e4567-e89b-12d3-a456-426614174000');
  console.log('Usuário deletado com sucesso');
} catch (error: any) {
  if (error.response?.status === 404) {
    alert('Usuário não encontrado');
  } else {
    console.error('Erro ao deletar usuário:', error);
  }
}
```

---

## 🔐 Roles Disponíveis

Os seguintes roles estão disponíveis para usuários:

- `admin` - Administrador do sistema
- `owner` - Dono da empresa
- `manager` - Gerente
- `cook` - Cozinheiro
- `attendant` - Atendente
- `customer` - Cliente
- `delivery` - Entregador

**Nota:** Apenas o role `admin` pode gerenciar usuários através da interface.

---

## 🎯 Controle de Acesso

A página de usuários (`/users`) verifica automaticamente se o usuário tem role `admin`. Se não for admin, será exibida uma mensagem de "Acesso Negado" e um botão para voltar ao dashboard.

```typescript
// Implementado em src/pages/app/Users/Users.tsx
const isAdmin = user?.role === 'admin';

if (!isAdmin) {
  return <AcessoNegado />;
}
```

---

## 📚 Arquivos Relacionados

- **Serviço:** `src/services/users/users.service.ts`
- **Types:** `src/services/users/users.types.ts`
- **Componente:** `src/pages/app/Users/Users.tsx`
- **Config HTTP:** `src/config/http.ts`
- **Error Handler:** `src/config/httpErrorHandler.ts`

---

**Última atualização**: 2024
