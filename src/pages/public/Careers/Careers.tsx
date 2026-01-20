import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Title, Label, Button } from '@components';

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

const jobs = [
  {
    position: 'Desenvolvedor(a) Frontend',
    location: 'Remoto',
    type: 'CLT',
  },
  {
    position: 'Product Owner',
    location: 'Florianópolis/SC',
    type: 'PJ',
  },
  {
    position: 'Designer UI/UX',
    location: 'Remoto',
    type: 'CLT',
  },
];

const Careers: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout 
      headerProps={{ onNavigate: (route) => navigate(route) }}
      footerProps={{ onNavigate: (route) => navigate(route) }}
    >
      <section className="flex flex-col items-center justify-center min-h-[80vh] w-full text-center px-4 py-12">
        <Title variant="h1" className="mb-3 text-foreground font-semibold">
          Trabalhe com a gente
        </Title>
        <Label as="p" className="mb-12 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Faça parte de um time que valoriza pessoas, tecnologia e inovação. Venha construir o
          futuro do food service com a gente!
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-16">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-background border border-border rounded-2xl p-8 flex flex-col items-start text-left hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-200"
            >
              <Title variant="h4" className="mb-3 text-primary font-semibold">
                {b.title}
              </Title>
              <Label as="p" className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {b.description}
              </Label>
            </div>
          ))}
        </div>
        <Title variant="h2" className="mb-6 text-foreground font-semibold">
          Vagas em aberto
        </Title>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mb-8">
          {jobs.map((job) => (
            <div
              key={job.position}
              className="bg-background border border-border rounded-2xl p-8 flex flex-col items-start hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-200"
            >
              <Title variant="h4" className="mb-4 text-primary font-semibold">
                {job.position}
              </Title>
              <Label as="p" className="mb-2 text-gray-600 dark:text-gray-400">
                Local: {job.location}
              </Label>
              <Label as="p" className="mb-6 text-gray-600 dark:text-gray-400">
                Tipo: {job.type}
              </Label>
              <Button className="w-full">Candidatar-se</Button>
            </div>
          ))}
        </div>
        <Label as="p" className="text-gray-600 dark:text-gray-400">
          Não encontrou a vaga ideal? Envie seu currículo para{' '}
          <a href="mailto:carreiras@fastfood.com" className="text-primary hover:underline font-medium">
            carreiras@fastfood.com
          </a>
        </Label>
      </section>
    </Layout>
  );
};

export default Careers;
