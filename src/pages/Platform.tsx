import React from 'react';
import { Layout, Title, Label, Button } from '@fast-food/design-system';

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

const Plataforma: React.FC = () => {
  return (
    <Layout>
      <section className="flex flex-col items-center justify-center min-h-[60vh] w-full text-center px-4">
        <Title variant="h1" className="mb-4">
          A Plataforma Completa para o seu Negócio
        </Title>
        <Label as="p" className="mb-8 text-lg max-w-2xl mx-auto">
          Tudo o que você precisa para gerenciar seu restaurante, lanchonete ou franquia, com
          tecnologia de ponta e experiência moderna.
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center"
            >
              <Title variant="h4" className="mb-2 text-primary">
                {f.title}
              </Title>
              <Label as="p" className="text-base text-gray-700 dark:text-gray-200">
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

export default Plataforma;
