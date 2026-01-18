import React, { useState } from 'react';
import { Layout, Title, Label, Input, Button } from '@fast-food/design-system';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!email.includes('@')) {
      setError('Digite um e-mail válido.');
      return;
    }
    setSent(true);
    // Integration with backend can be done here
  };

  return (
    <Layout>
      <section className="flex flex-col items-center justify-center min-h-[80vh] w-full text-center px-4 py-12">
        <Title variant="h1" className="mb-3 text-foreground font-semibold">
          Esqueceu sua senha?
        </Title>
        <Label as="p" className="mb-8 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Informe seu e-mail cadastrado para receber as instruções de recuperação de senha.
        </Label>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 w-full max-w-lg mb-8 bg-background border border-border rounded-2xl p-8 text-left"
        >
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
          />
          {error && (
            <Label as="p" className="text-error mt-2 text-sm">
              {error}
            </Label>
          )}
          <Button type="submit" className="w-full mt-2">
            Enviar instruções
          </Button>
          {sent && (
            <Label as="p" className="text-success mt-2 text-sm">
              Se o e-mail estiver cadastrado, você receberá as instruções em instantes.
            </Label>
          )}
        </form>
      </section>
    </Layout>
  );
};

export default ForgotPassword;
