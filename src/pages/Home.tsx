import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Title, Label, Button } from '@fast-food/design-system';
import { ROUTES } from '../routes';

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
  const navigate = useNavigate();

  return (
    <Layout headerProps={{ onNavigate: (route: string) => navigate(route) }}>
      <section className="flex flex-col items-center justify-center min-h-[80vh] w-full text-center px-4 py-16">
        <Title variant="h1" className="mb-6 text-foreground font-semibold leading-tight">
          Gerencie seu restaurante de forma simples e moderna
        </Title>
        <Label as="p" className="mb-12 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Plataforma completa para gestão de restaurantes, lanchonetes e franquias. Controle tudo em
          um só lugar, com segurança, agilidade e visual moderno.
        </Label>
        <Button className="mb-16 w-full max-w-xs" onClick={() => navigate(ROUTES.REGISTER)}>
          Comece agora
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-background border border-border rounded-2xl p-8 flex flex-col items-start text-left hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-200"
            >
              <Title variant="h3" className="mb-3 text-primary font-semibold">
                {b.title}
              </Title>
              <Label as="p" className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
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
