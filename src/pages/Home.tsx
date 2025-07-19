import React from 'react';
import { Layout, Title, Label, Button } from '@fast-food/design-system';

const benefits = [
  {
    title: 'Gestão Completa',
    description: 'Controle empresas, filiais, produtos, pedidos e equipe em um só lugar.',
  },
  {
    title: 'Interface Moderna',
    description: 'Visual limpo, responsivo e fácil de usar, inspirado nas melhores fintechs.',
  },
  {
    title: 'Planos Flexíveis',
    description: 'Escolha o plano ideal para o seu negócio, do pequeno ao grande porte.',
  },
];

const Home: React.FC = () => {
  return (
    <Layout>
      <section className="flex flex-col items-center justify-center min-h-[60vh] w-full text-center px-4">
        <Title variant="h1" className="mb-4">
          Gerencie seu restaurante de forma simples e moderna
        </Title>
        <Label as="p" className="mb-8 text-lg max-w-2xl mx-auto">
          Plataforma completa para gestão de restaurantes, lanchonetes e franquias. Controle tudo em
          um só lugar, com segurança, agilidade e visual moderno.
        </Label>
        <Button className="mb-12 w-full max-w-xs">Comece agora</Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center"
            >
              <Title variant="h3" className="mb-2 text-primary">
                {b.title}
              </Title>
              <Label as="p" className="text-base text-gray-700 dark:text-gray-200">
                {b.description}
              </Label>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Home;
