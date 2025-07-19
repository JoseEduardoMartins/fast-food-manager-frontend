import React from 'react';
import { Layout, Title, Label, Button } from '@fast-food/design-system';

const benefits = [
  {
    title: 'Ambiente Colaborativo',
    description: 'Trabalhe com pessoas apaixonadas por tecnologia e inovação.',
  },
  {
    title: 'Crescimento Profissional',
    description:
      'Incentivamos o desenvolvimento contínuo e oferecemos oportunidades reais de carreira.',
  },
  {
    title: 'Flexibilidade',
    description: 'Horários flexíveis e possibilidade de trabalho remoto.',
  },
];

const vagas = [
  {
    cargo: 'Desenvolvedor(a) Frontend',
    local: 'Remoto',
    tipo: 'CLT',
  },
  {
    cargo: 'Product Owner',
    local: 'Florianópolis/SC',
    tipo: 'PJ',
  },
  {
    cargo: 'Designer UI/UX',
    local: 'Remoto',
    tipo: 'CLT',
  },
];

const Carreira: React.FC = () => {
  return (
    <Layout>
      <section className="flex flex-col items-center justify-center min-h-[60vh] w-full text-center px-4">
        <Title variant="h1" className="mb-4">
          Trabalhe com a gente
        </Title>
        <Label as="p" className="mb-8 text-lg max-w-2xl mx-auto">
          Faça parte de um time que valoriza pessoas, tecnologia e inovação. Venha construir o
          futuro do food service com a gente!
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center"
            >
              <Title variant="h4" className="mb-2 text-primary">
                {b.title}
              </Title>
              <Label as="p" className="text-base text-gray-700 dark:text-gray-200">
                {b.description}
              </Label>
            </div>
          ))}
        </div>
        <Title variant="h2" className="mb-4">
          Vagas em aberto
        </Title>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mb-8">
          {vagas.map((vaga) => (
            <div
              key={vaga.cargo}
              className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-start"
            >
              <Title variant="h4" className="mb-2 text-primary">
                {vaga.cargo}
              </Title>
              <Label as="p" className="mb-1">
                Local: {vaga.local}
              </Label>
              <Label as="p" className="mb-4">
                Tipo: {vaga.tipo}
              </Label>
              <Button className="w-full">Candidatar-se</Button>
            </div>
          ))}
        </div>
        <Label as="p" className="text-gray-600 dark:text-gray-300">
          Não encontrou a vaga ideal? Envie seu currículo para{' '}
          <a href="mailto:carreiras@fastfood.com" className="text-primary">
            carreiras@fastfood.com
          </a>
        </Label>
      </section>
    </Layout>
  );
};

export default Carreira;
