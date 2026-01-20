# Authentication Service

Serviço de autenticação do Fast Food Manager Frontend.

## Funcionalidades

- ✅ Registro de novos usuários (Sign Up)
- ✅ Login de usuários (Sign In)
- ✅ Confirmação de email via código de 6 dígitos
- ✅ Logout (Sign Out)
- ✅ Gerenciamento automático de tokens

## Uso

### Importar o serviço

```typescript
import { signUp, signIn, confirmSignUp, signOut } from '@services/auth';
import type { SignUpRequest, SignInRequest, ConfirmSignUpRequest } from '@services/auth';
```

### Sign Up (Registro)

```typescript
import { signUp } from '@services/auth';

try {
  const response = await signUp({
    name: 'João Silva',
    email: 'joao.silva@example.com',
    password: 'senha123',
    role: 'customer'
  });
  
  console.log('Usuário criado:', response.id);
  // Redirecionar para tela de confirmação de email
} catch (error) {
  console.error('Erro ao criar usuário:', error);
}
```

### Sign In (Login)

```typescript
import { signIn } from '@services/auth';

try {
  const response = await signIn({
    email: 'joao.silva@example.com',
    password: 'senha123'
  });
  
  console.log('Login realizado:', response.user);
  // Tokens são armazenados automaticamente
  // Redirecionar para dashboard
} catch (error) {
  if (error.response?.status === 401) {
    // Email não confirmado ou credenciais inválidas
    const message = error.response.data?.message;
    if (message?.includes('confirmação')) {
      // Redirecionar para tela de confirmação
    }
  }
  console.error('Erro ao fazer login:', error);
}
```

### Confirm Sign Up (Confirmar Email)

```typescript
import { confirmSignUp } from '@services/auth';

try {
  const response = await confirmSignUp({
    email: 'joao.silva@example.com',
    securityCode: '123456'
  });
  
  console.log('Email confirmado:', response.message);
  // Redirecionar para tela de login
} catch (error) {
  console.error('Erro ao confirmar email:', error);
}
```

### Sign Out (Logout)

```typescript
import { signOut } from '@services/auth';

signOut();
// Tokens são removidos automaticamente
// Redirecionar para tela de login
```

## Tipos

### SignUpRequest

```typescript
interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  companyId?: string;
  branchId?: string;
}
```

### SignInRequest

```typescript
interface SignInRequest {
  email: string;
  password: string;
}
```

### ConfirmSignUpRequest

```typescript
interface ConfirmSignUpRequest {
  email: string;
  securityCode: string;
}
```

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string | null;
  branchId: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Tratamento de Erros

O serviço usa o `httpErrorHandler` que trata automaticamente:

- **401 Unauthorized**: Redireciona para `/login` se token inválido
- **400 Bad Request**: Log de erro no console
- **409 Conflict**: Email já está em uso
- **404 Not Found**: Recurso não encontrado
- **500 Server Error**: Erro interno do servidor

## Tokens

Os tokens são gerenciados automaticamente:

- **Access Token**: Armazenado como cookie com expiração de 30 minutos
- **Refresh Token**: Armazenado como cookie com expiração de 24 horas
- Os tokens são adicionados automaticamente nas requisições via header `token`

## Notas

- O serviço usa o header `token` ao invés de `Authorization: Bearer` conforme a API do backend
- Os tokens são armazenados em cookies com sufixo do modo de aplicação (`${key}_${application.mode}`)
- O serviço usa o `http` instance que já possui interceptors configurados
