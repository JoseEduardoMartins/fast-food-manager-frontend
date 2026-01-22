import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, Store, Package, UtensilsCrossed, LeafyGreen, DollarSign, ShoppingCart, UserPlus } from 'lucide-react';
import { AppLayout, Title, Label, Button, Card, PageHeader, StatCard } from '@components';
import { useAuth } from '@contexts';
import { ROUTES } from '@common/constants';

// Cards for regular users (owners, managers, etc)
const regularUserCards = [
  {
    title: 'Pedidos do dia',
    value: 27,
    description: 'Pedidos realizados hoje',
    icon: ShoppingCart,
  },
  {
    title: 'Faturamento',
    value: 'R$ 2.350,00',
    description: 'Total faturado hoje',
    icon: DollarSign,
  },
  {
    title: 'Produtos em estoque',
    value: 134,
    description: 'Itens disponíveis no estoque',
    icon: Package,
  },
  {
    title: 'Novos clientes',
    value: 5,
    description: 'Clientes cadastrados hoje',
    icon: UserPlus,
  },
];

// Cards for admin users
const adminCards = [
  {
    title: 'Total de Proprietários',
    value: '12',
    description: 'Owners cadastrados no sistema',
    route: ROUTES.USERS,
    icon: Users,
  },
  {
    title: 'Empresas Ativas',
    value: '8',
    description: 'Companies registradas',
    icon: Building2,
  },
  {
    title: 'Filiais',
    value: '24',
    description: 'Branches em operação',
    icon: Store,
  },
  {
    title: 'Pedidos Hoje',
    value: '1.234',
    description: 'Orders processados hoje',
    icon: Package,
  },
  {
    title: 'Produtos Cadastrados',
    value: '456',
    description: 'Products no sistema',
    icon: UtensilsCrossed,
  },
  {
    title: 'Ingredientes',
    value: '89',
    description: 'Ingredients disponíveis',
    icon: LeafyGreen,
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <div className="container py-8">
        <PageHeader
          title={isAdmin ? 'Painel Administrativo' : 'Bem-vindo ao seu painel'}
          description={
            isAdmin
              ? 'Visão geral do sistema e acesso rápido às funcionalidades de gerenciamento'
              : 'Aqui você acompanha os principais indicadores do seu negócio em tempo real.'
          }
        />

        {/* Statistics Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${isAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6 mb-8`}>
          {(isAdmin ? adminCards : regularUserCards).map((card) => {
            const hasRoute = 'route' in card && card.route && card.route !== '#';
            const handleClick = hasRoute ? () => navigate(card.route as string) : undefined;
            
            return (
              <StatCard
                key={card.title}
                title={card.title}
                value={card.value}
                description={card.description}
                icon={'icon' in card ? card.icon : undefined}
                onClick={handleClick}
              />
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
    </AppLayout>
  );
};

export default Dashboard;
