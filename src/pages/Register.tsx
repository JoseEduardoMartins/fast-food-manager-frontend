import React, { useState } from 'react';
import { Layout, Title, Label, Input, Button } from '@fast-food/design-system';

const Cadastro: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro('');
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }
    setEnviado(true);
    // Aqui pode ser feita a integração com backend
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
            value={nome}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
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
            value={senha}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
            required
          />
          <Input
            label="Confirmar senha"
            type="password"
            value={confirmarSenha}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmarSenha(e.target.value)}
            required
          />
          {erro && (
            <Label as="p" className="text-error mt-2 text-sm">
              {erro}
            </Label>
          )}
          <Button type="submit" className="w-full mt-2">
            Cadastrar
          </Button>
          {enviado && (
            <Label as="p" className="text-success mt-2 text-sm">
              Cadastro realizado com sucesso!
            </Label>
          )}
        </form>
      </section>
    </Layout>
  );
};

export default Cadastro;
