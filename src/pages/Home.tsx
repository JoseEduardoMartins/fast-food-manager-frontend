import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Title, Label, Button } from '@fast-food/design-system';
import { ROUTES } from '../routes';

const benefits = [
  {
    icon: '📊',
    title: 'Gestão Completa',
    description: 'Controle empresas, filiais, produtos, pedidos e equipe em um só lugar.',
  },
  {
    icon: '🎨',
    title: 'Interface Moderna',
    description: 'Visual limpo, responsivo e fácil de usar, inspirado nas melhores fintechs.',
  },
  {
    icon: '💎',
    title: 'Planos Flexíveis',
    description: 'Escolha o plano ideal para o seu negócio, do pequeno ao grande porte.',
  },
];

const features = [
  {
    title: 'Gestão de Usuários',
    description: 'Controle permissões e acessos de toda a equipe, de forma simples e segura.',
  },
  {
    title: 'Pedidos em Tempo Real',
    description: 'Gerencie pedidos em tempo real e mantenha o estoque sempre atualizado.',
  },
  {
    title: 'Relatórios Inteligentes',
    description: 'Acompanhe o desempenho do seu negócio com dashboards e relatórios detalhados.',
  },
  {
    title: 'Integração Completa',
    description: 'Conecte com sistemas externos e ofereça uma experiência completa para seus clientes.',
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout headerProps={{ onNavigate: (route: string) => navigate(route) }}>
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[85vh] w-full text-center px-4 py-20">
        <Title variant="h1" className="mb-6 text-foreground font-bold text-4xl md:text-5xl lg:text-6xl leading-tight max-w-4xl mx-auto">
          Gerencie seu restaurante de forma simples e moderna
        </Title>
        <Label as="p" className="mb-4 text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
          Plataforma completa para gestão de restaurantes, lanchonetes e franquias. Controle tudo em
          um só lugar, com segurança, agilidade e visual moderno.
        </Label>
        <Label as="p" className="mb-12 text-xl md:text-2xl text-foreground font-semibold">
          Teste grátis!
        </Label>
        <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full max-w-md justify-center">
          <Button className="w-full sm:w-auto px-8 py-3 text-lg" onClick={() => navigate(ROUTES.REGISTER)}>
            Comece agora
          </Button>
          <Button 
            variant="secondary" 
            className="w-full sm:w-auto px-8 py-3 text-lg" 
            onClick={() => navigate(ROUTES.PLATFORM)}
          >
            Saiba mais
          </Button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="flex flex-col items-center w-full px-4 py-16 bg-gray-50 dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-background border border-border rounded-2xl p-8 flex flex-col items-center text-center hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-lg"
            >
              <Label as="span" className="text-5xl mb-4" aria-hidden="true">
                {b.icon}
              </Label>
              <Title variant="h3" className="mb-4 text-primary font-semibold">
                {b.title}
              </Title>
              <Label as="p" className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {b.description}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="flex flex-col items-center w-full px-4 py-20">
        <Title variant="h2" className="mb-4 text-foreground font-semibold text-center text-3xl">
          Recursos que fazem a diferença
        </Title>
        <Label as="p" className="mb-12 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-center">
          Tudo o que você precisa para gerenciar seu negócio com eficiência e modernidade.
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-background border border-border rounded-xl p-6 flex flex-col items-start text-left hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-200"
            >
              <Title variant="h4" className="mb-2 text-primary font-semibold">
                {f.title}
              </Title>
              <Label as="p" className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {f.description}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="flex flex-col items-center w-full px-4 py-20 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-2xl text-center">
          <Title variant="h2" className="mb-4 text-foreground font-semibold text-2xl md:text-3xl">
            Pronto para transformar seu negócio?
          </Title>
          <Label as="p" className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            Comece hoje mesmo e veja a diferença que uma gestão moderna pode fazer.
          </Label>
          <Button className="w-full max-w-xs mx-auto" onClick={() => navigate(ROUTES.REGISTER)}>
            Teste grátis agora
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
