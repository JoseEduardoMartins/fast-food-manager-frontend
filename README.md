# Fast Food Manager - Frontend

Sistema completo de gestão para restaurantes, lanchonetes e franquias. Uma plataforma moderna com interface intuitiva e responsiva, desenvolvida para facilitar o gerenciamento de empresas, filiais, produtos, pedidos e equipe.

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Como Executar](#-como-executar)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Funcionalidades](#-funcionalidades)
- [Desenvolvimento](#-desenvolvimento)

## 🚀 Sobre o Projeto

O **Fast Food Manager Frontend** é uma aplicação web moderna desenvolvida para gerenciar restaurantes, lanchonetes e franquias. O sistema oferece uma interface limpa e intuitiva, inspirada nas melhores fintechs, proporcionando uma experiência de usuário excepcional.

### Principais Características

- ✅ Gestão completa de empresas, filiais e equipe
- ✅ Interface moderna e responsiva
- ✅ Planos flexíveis (Preta, Ouro, Diamante)
- ✅ Validação de formulários robusta
- ✅ Navegação intuitiva com React Router
- ✅ Design System customizado

## 🛠 Tecnologias Utilizadas

### Core

- **[React 19](https://react.dev/)** - Biblioteca JavaScript para construção de interfaces de usuário
  - Versão mais recente do React com melhorias de performance e novas APIs
  - Hooks modernos para gerenciamento de estado e efeitos colaterais

- **[TypeScript ~5.8.3](https://www.typescriptlang.org/)** - Superset do JavaScript com tipagem estática
  - Aumenta a produtividade e reduz erros em tempo de desenvolvimento
  - Facilita a manutenção e refatoração do código

- **[Vite 7.0.4](https://vitejs.dev/)** - Build tool e dev server extremamente rápido
  - Hot Module Replacement (HMR) instantâneo
  - Build otimizado para produção com tree-shaking
  - Suporte nativo para ES modules

### Roteamento e Formulários

- **[React Router DOM 7.7.0](https://reactrouter.com/)** - Roteamento declarativo para aplicações React
  - Navegação client-side sem recarregar a página
  - Suporte a rotas protegidas e lazy loading

- **[React Hook Form 7.60.0](https://react-hook-form.com/)** - Biblioteca performática para formulários
  - Validação eficiente com re-renders mínimos
  - Integração simples com validadores externos

- **[Zod 4.0.5](https://zod.dev/)** - Validação de esquemas TypeScript-first
  - Type-safe schema validation
  - Integração perfeita com React Hook Form via `@hookform/resolvers`

### UI e Design

- **[@fast-food/design-system 1.18.0](https://www.npmjs.com/package/@fast-food/design-system)** - Design System customizado
  - Componentes reutilizáveis padronizados
  - Estilos consistentes baseados em Tailwind CSS
  - Suporte a tema claro/escuro

- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
  - Estilização rápida e consistente
  - Customização através do design system

### Testes

- **[Vitest 3.2.4](https://vitest.dev/)** - Framework de testes rápido baseado em Vite
  - Compatível com Jest
  - Execução rápida de testes

- **[Jest 30.0.4](https://jestjs.io/)** - Framework de testes JavaScript
  - Suporte a testes unitários e de integração

- **[@testing-library/react 16.3.0](https://testing-library.com/react)** - Utilitários para testar componentes React
  - Testes focados no comportamento do usuário

### Qualidade de Código

- **[ESLint 9.31.0](https://eslint.org/)** - Linter para JavaScript/TypeScript
  - Regras para React Hooks
  - TypeScript ESLint integrado
  - Detecção de imports não utilizados

- **[Prettier 3.6.2](https://prettier.io/)** - Formatador de código opinativo
  - Formatação consistente em todo o projeto

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **[Node.js](https://nodejs.org/)** (versão 18 ou superior recomendada)
- **[npm](https://www.npmjs.com/)** (geralmente vem junto com Node.js) ou **[yarn](https://yarnpkg.com/)**
- **[Git](https://git-scm.com/)** (para clonar o repositório)

### Verificando as versões instaladas

```bash
node --version
npm --version
git --version
```

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone git@github.com:JoseEduardoMartins/fast-food-manager-frontend.git
cd fast-food-manager-frontend
```

### 2. Instale as dependências

Usando npm:

```bash
npm install
```

Ou usando yarn:

```bash
yarn install
```

### 3. Verifique se tudo foi instalado corretamente

```bash
npm list --depth=0
```

## ▶️ Como Executar

### Modo de Desenvolvimento

Para iniciar o servidor de desenvolvimento com Hot Module Replacement:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:5173` (porta padrão do Vite).

A aplicação será recarregada automaticamente sempre que você modificar os arquivos do código.

### Modo de Produção

Para criar uma build otimizada para produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

Para visualizar a build de produção localmente:

```bash
npm run preview
```

## 📜 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Cria a build de produção |
| `npm run preview` | Visualiza a build de produção localmente |
| `npm run lint` | Executa o ESLint para verificar problemas no código |
| `npm run test` | Executa os testes com Jest |
| `npm run vitest` | Executa os testes com Vitest |
| `npm run format` | Formata o código com Prettier |

## 📁 Estrutura do Projeto

```
fast-food-manager-frontend/
├── public/                 # Arquivos estáticos públicos
│   └── vite.svg
├── src/
│   ├── assets/            # Imagens e outros assets
│   │   └── react.svg
│   ├── components/        # Componentes reutilizáveis
│   │   └── atoms/         # Componentes atômicos
│   │       ├── CPFInput/
│   │       ├── EmailInput/
│   │       ├── PasswordInput/
│   │       └── PhoneInput/
│   ├── pages/             # Páginas da aplicação
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── OwnerRegister.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Platform.tsx
│   │   ├── Contact.tsx
│   │   └── Careers.tsx
│   ├── App.tsx            # Componente principal e rotas
│   ├── App.css            # Estilos globais do App
│   ├── main.tsx           # Ponto de entrada da aplicação
│   ├── index.css          # Estilos globais
│   ├── global.d.ts        # Declarações de tipos globais
│   └── vite-env.d.ts      # Tipos do Vite
├── .gitignore
├── eslint.config.js       # Configuração do ESLint
├── jest.config.js         # Configuração do Jest
├── package.json        # Dependências e scripts
├── package-lock.json      # Lock file das dependências
├── README.md              # Este arquivo
├── tsconfig.json          # Configuração TypeScript (composite)
├── tsconfig.app.json      # Configuração TypeScript da aplicação
├── tsconfig.node.json     # Configuração TypeScript do Node
├── vite.config.ts         # Configuração do Vite
└── vitest.config.ts       # Configuração do Vitest
```

## 🎯 Funcionalidades

### Rotas Disponíveis

- `/` - Página inicial (Home)
- `/login` - Página de login
- `/register` - Cadastro de usuário
- `/owner-register` - Cadastro de proprietário com seleção de planos
- `/forgot-password` - Recuperação de senha
- `/dashboard` - Painel administrativo com métricas
- `/platform` - Informações sobre a plataforma
- `/contact` - Formulário de contato
- `/careers` - Página de carreiras e vagas

### Páginas Principais

#### 🏠 Home
Landing page com apresentação do sistema, benefícios e call-to-action.

#### 🔐 Login
Formulário de autenticação com validação usando React Hook Form e Zod.

#### 👤 Register
Cadastro de novos usuários com validação de formulário.

#### 👨‍💼 OwnerRegister
Cadastro de proprietários com seleção de planos:
- **Preta**: 1 empresa, 2 filiais, 2 gerentes
- **Ouro**: 2 empresas, 4 filiais, 4 gerentes
- **Diamante**: 3 empresas, 6 filiais, 6 gerentes

#### 📊 Dashboard
Painel com métricas em tempo real:
- Pedidos do dia
- Faturamento
- Produtos em estoque
- Novos clientes

## 💻 Desenvolvimento

### Padrões de Código

- **TypeScript**: Tipagem estrita habilitada
- **React Hooks**: Uso preferencial de hooks funcionais
- **Componentes**: Estrutura de pastas seguindo Atomic Design
- **Formulários**: React Hook Form com validação Zod

### Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

### Linting e Formatação

Execute o linter antes de commitar:

```bash
npm run lint
```

Formate o código:

```bash
npm run format
```

### Executando Testes

Com Jest:

```bash
npm run test
```

Com Vitest:

```bash
npm run vitest
```

Para interface interativa do Vitest:

```bash
npm run vitest -- --ui
```

## 📝 Notas Adicionais

- O projeto utiliza o Design System `@fast-food/design-system` que deve estar configurado corretamente no ambiente
- As rotas são gerenciadas pelo React Router DOM v7
- Os formulários utilizam validação com Zod para type-safety completo
- O projeto está configurado com ESLint e Prettier para manter a qualidade do código

## 📄 Licença

Este projeto é privado e pertence à Fast Food Manager.

---

**Desenvolvido com ❤️ para facilitar a gestão de restaurantes e lanchonetes**
