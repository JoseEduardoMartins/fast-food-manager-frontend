import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Title, Label, Button } from '@components';
import { useAuth } from '@contexts';

const features = [
  {
    title: 'Gestão de Usuários',
    description: 'Controle permissões e acessos de toda a equipe, de forma simples e segura.',
  },
  {
    title: 'Pedidos e Estoque',
    description: 'Gerencie pedidos em tempo real e mantenha o estoque sempre atualizado.',
  },
  {
    title: 'Relatórios Inteligentes',
    description: 'Acompanhe o desempenho do seu negócio com dashboards e relatórios detalhados.',
  },
  {
    title: 'Integração com Totem',
    description: 'Ofereça autoatendimento moderno para seus clientes, integrado ao sistema.',
  },
  {
    title: 'Gestão de Cardápio',
    description: 'Atualize produtos, categorias e preços de forma rápida e centralizada.',
  },
  {
    title: 'Multi-empresa e Multi-filial',
    description: 'Gerencie várias empresas e filiais em uma única plataforma.',
  },
];

const Platform: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();

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
      <section className="flex flex-col items-center justify-center min-h-[80vh] w-full text-center px-4 py-12">
        <Title variant="h1" className="mb-3 text-foreground font-semibold">
          A Plataforma Completa para o seu Negócio
        </Title>
        <Label as="p" className="mb-12 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Tudo o que você precisa para gerenciar seu restaurante, lanchonete ou franquia, com
          tecnologia de ponta e experiência moderna.
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl mb-12">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-background border border-border rounded-2xl p-8 flex flex-col items-start text-left hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-200"
            >
              <Title variant="h4" className="mb-3 text-primary font-semibold">
                {f.title}
              </Title>
              <Label as="p" className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {f.description}
              </Label>
            </div>
          ))}
        </div>
        <Button className="w-full max-w-xs">Solicite uma demonstração</Button>
      </section>
    </Layout>
  );
};

export default Platform;
