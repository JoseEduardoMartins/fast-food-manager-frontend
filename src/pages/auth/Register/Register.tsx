import React, { useState } from 'react';
import { Layout, Title, Label, Input, Button } from '@components';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setSubmitted(true);
    // Integration with backend can be done here
  };

  return (
    <Layout>
      <section className="flex flex-col items-center justify-center min-h-[80vh] w-full text-center px-4 py-12">
        <Title variant="h1" className="mb-3 text-foreground font-semibold">
          Crie sua conta
        </Title>
        <Label as="p" className="mb-8 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Preencha os campos abaixo para criar sua conta e aproveitar todos os recursos da
          plataforma.
        </Label>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 w-full max-w-lg mb-8 bg-background border border-border rounded-2xl p-8 text-left"
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
            label="Senha"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
          />
          <Input
            label="Confirmar senha"
            type="password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            required
          />
          {error && (
            <Label as="p" className="text-error mt-2 text-sm">
              {error}
            </Label>
          )}
          <Button type="submit" className="w-full mt-2">
            Cadastrar
          </Button>
          {submitted && (
            <Label as="p" className="text-success mt-2 text-sm">
              Cadastro realizado com sucesso!
            </Label>
          )}
        </form>
      </section>
    </Layout>
  );
};

export default Register;
