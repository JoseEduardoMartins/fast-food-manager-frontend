import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Title, Label, Input, Button } from '@components';
import { useAuth } from '@contexts';

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    // Integration with backend or email service can be done here
  };

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
          Fale com a gente
        </Title>
        <Label as="p" className="mb-12 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Tem dúvidas, sugestões ou quer falar com nosso time? Preencha o formulário ou utilize
          nossos canais de atendimento.
        </Label>
        <div className="w-full max-w-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 w-full bg-background border border-border rounded-2xl p-8 text-left"
          >
            <Input
              label="Nome"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
            />
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Mensagem"
              as="textarea"
              rows={4}
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              required
            />
            <Button type="submit" className="w-full mt-2">
              Enviar mensagem
            </Button>
            {sent && (
              <Label as="p" className="text-success mt-2 text-sm">
                Mensagem enviada com sucesso!
              </Label>
            )}
          </form>
          <div className="w-full bg-background border border-border rounded-2xl p-8 text-left flex flex-col justify-center">
            <Title variant="h4" className="mb-6 text-foreground font-semibold">
              Outros canais
            </Title>
            <div className="space-y-4">
              <div>
                <Label as="p" className="text-gray-600 dark:text-gray-400 mb-1">
                  Telefone
                </Label>
                <a href="tel:+5548999999999" className="text-primary hover:underline font-medium">
                  (48) 99999-9999
                </a>
              </div>
              <div>
                <Label as="p" className="text-gray-600 dark:text-gray-400 mb-1">
                  E-mail
                </Label>
                <a href="mailto:contato@fastfood.com" className="text-primary hover:underline font-medium">
                  contato@fastfood.com
                </a>
              </div>
              <div>
                <Label as="p" className="text-gray-600 dark:text-gray-400 mb-1">
                  Endereço
                </Label>
                <Label as="p" className="text-foreground">
                  Rua Exemplo, 123 - Centro, Florianópolis/SC
                </Label>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
