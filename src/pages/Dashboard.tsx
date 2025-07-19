import React from 'react';
import { Layout, Title, Label, Button } from '@fast-food/design-system';

const cards = [
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

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <section className="flex flex-col items-center justify-center min-h-[60vh] w-full text-center px-4">
        <Title variant="h1" className="mb-4">
          Bem-vindo ao seu painel
        </Title>
        <Label as="p" className="mb-8 text-lg max-w-2xl mx-auto">
          Aqui você acompanha os principais indicadores do seu negócio em tempo real.
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-12">
          {cards.map((c) => (
            <div
              key={c.title}
              className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center"
            >
              <Title variant="h3" className="mb-2 text-primary">
                {c.value}
              </Title>
              <Label as="p" className="font-semibold mb-1">
                {c.title}
              </Label>
              <Label as="p" className="text-gray-600 dark:text-gray-300 text-sm">
                {c.description}
              </Label>
            </div>
          ))}
        </div>
        <Button className="w-full max-w-xs">Ver relatórios completos</Button>
      </section>
    </Layout>
  );
};

export default Dashboard;
