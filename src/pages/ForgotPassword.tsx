import React, { useState } from 'react';
import { Layout, Title, Label, Input, Button } from '@fast-food/design-system';

const EsqueceuSenha: React.FC = () => {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro('');
    if (!email.includes('@')) {
      setErro('Digite um e-mail válido.');
      return;
    }
    setEnviado(true);
    // Aqui pode ser feita a integração com backend
  };

  return (
    <Layout>
      <section className="flex flex-col items-center justify-center min-h-[60vh] w-full text-center px-4">
        <Title variant="h1" className="mb-4">
          Esqueceu sua senha?
        </Title>
        <Label as="p" className="mb-8 text-lg max-w-2xl mx-auto">
          Informe seu e-mail cadastrado para receber as instruções de recuperação de senha.
        </Label>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-lg mb-8 bg-white dark:bg-gray-900 rounded-xl shadow p-8 text-left"
        >
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
          />
          {erro && (
            <Label as="p" className="text-red-600 mt-2">
              {erro}
            </Label>
          )}
          <Button type="submit" className="w-full">
            Enviar instruções
          </Button>
          {enviado && (
            <Label as="p" className="text-green-600 mt-2">
              Se o e-mail estiver cadastrado, você receberá as instruções em instantes.
            </Label>
          )}
        </form>
      </section>
    </Layout>
  );
};

export default EsqueceuSenha;
