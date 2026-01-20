import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Title, Label, Button, Card } from '@components';
import { useAuth } from '@contexts';
import { ROUTES } from '@common/constants';

// Cards for regular users (owners, managers, etc)
const regularUserCards = [
  {
    title: 'Pedidos do dia',
    value: 27,
    description: 'Pedidos realizados hoje',
  },
  {
    title: 'Faturamento',
    value: 'R$ 2.350,00',
    description: 'Total faturado hoje',
  },
  {
    title: 'Produtos em estoque',
    value: 134,
    description: 'Itens disponíveis no estoque',
  },
  {
    title: 'Novos clientes',
    value: 5,
    description: 'Clientes cadastrados hoje',
  },
];

// Cards for admin users
const adminCards = [
  {
    title: 'Total de Proprietários',
    value: '12',
    description: 'Owners cadastrados no sistema',
    route: ROUTES.USERS,
    icon: '👥',
  },
  {
    title: 'Empresas Ativas',
    value: '8',
    description: 'Companies registradas',
    icon: '🏢',
  },
  {
    title: 'Filiais',
    value: '24',
    description: 'Branches em operação',
    icon: '🏪',
  },
  {
    title: 'Pedidos Hoje',
    value: '1.234',
    description: 'Orders processados hoje',
    icon: '📦',
  },
  {
    title: 'Produtos Cadastrados',
    value: '456',
    description: 'Products no sistema',
    icon: '🍔',
  },
  {
    title: 'Ingredientes',
    value: '89',
    description: 'Ingredients disponíveis',
    icon: '🥬',
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Layout 
      headerProps={{ 
        onNavigate: (route) => navigate(route),
        user,
        isAuthenticated,
        onSignOut: signOut,
      }}
      footerProps={{ 
        onNavigate: (route) => navigate(route),
        user,
        isAuthenticated,
      }}
    >
      <div className="container py-8">
        <div className="mb-8">
          <Title variant="h1" className="mb-2 text-foreground font-semibold">
            {isAdmin ? 'Painel Administrativo' : 'Bem-vindo ao seu painel'}
          </Title>
          <Label as="p" className="text-gray-600 dark:text-gray-400">
            {isAdmin
              ? 'Visão geral do sistema e acesso rápido às funcionalidades de gerenciamento'
              : 'Aqui você acompanha os principais indicadores do seu negócio em tempo real.'}
          </Label>
        </div>

        {/* Statistics Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${isAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6 mb-8`}>
          {(isAdmin ? adminCards : regularUserCards).map((card) => {
            const hasRoute = 'route' in card && card.route && card.route !== '#';
            const handleClick = hasRoute ? () => navigate(card.route as string) : undefined;
            
            return (
              <Card
                key={card.title}
                className={`p-6 flex flex-col items-start text-left hover:border-primary transition-colors ${
                  hasRoute ? 'cursor-pointer' : ''
                }`}
                onClick={handleClick}
              >
                {'icon' in card && (
                  <div className="flex items-start justify-between mb-4 w-full">
                    <div className="text-4xl">{card.icon as string}</div>
                    <Title variant="h2" className="text-primary font-bold text-3xl">
                      {String(card.value)}
                    </Title>
                  </div>
                )}
              {!('icon' in card) && (
                <Title variant="h2" className="mb-3 text-primary font-bold text-3xl">
                  {card.value}
                </Title>
              )}
              <Label as="p" className="font-semibold mb-2 text-foreground">
                {card.title}
              </Label>
              <Label as="p" className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {card.description}
              </Label>
            </Card>
            );
          })}
        </div>

        {/* Quick Actions - Only for Admin */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <Title variant="h3" className="mb-4 font-semibold">
                Gerenciamento de Usuários
              </Title>
              <Label as="p" className="mb-4 text-gray-600 dark:text-gray-400">
                Gerencie proprietários, gerentes, cozinheiros, atendentes e clientes
              </Label>
              <Button onClick={() => navigate(ROUTES.USERS)} className="w-full">
                Gerenciar Usuários
              </Button>
            </Card>

            <Card className="p-6">
              <Title variant="h3" className="mb-4 font-semibold">
                Gerenciamento de Empresas
              </Title>
              <Label as="p" className="mb-4 text-gray-600 dark:text-gray-400">
                Gerencie empresas, filiais e suas configurações
              </Label>
              <Button className="w-full" disabled>
                Em breve
              </Button>
            </Card>

            <Card className="p-6">
              <Title variant="h3" className="mb-4 font-semibold">
                Gerenciamento de Pedidos
              </Title>
              <Label as="p" className="mb-4 text-gray-600 dark:text-gray-400">
                Visualize e gerencie todos os pedidos do sistema
              </Label>
              <Button className="w-full" disabled>
                Em breve
              </Button>
            </Card>

            <Card className="p-6">
              <Title variant="h3" className="mb-4 font-semibold">
                Gerenciamento de Estoque
              </Title>
              <Label as="p" className="mb-4 text-gray-600 dark:text-gray-400">
                Controle produtos, ingredientes e níveis de estoque
              </Label>
              <Button className="w-full" disabled>
                Em breve
              </Button>
            </Card>
          </div>
        )}

        {/* Regular User Actions */}
        {!isAdmin && (
          <div className="flex justify-center">
            <Button className="w-full max-w-xs">Ver relatórios completos</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
