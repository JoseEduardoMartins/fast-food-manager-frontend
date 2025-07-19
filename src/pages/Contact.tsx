import React, { useState } from 'react';
import { Layout, Title, Label, Input, Button } from '@fast-food/design-system';

const Contato: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviado(true);
    // Aqui pode ser feita a integração com backend ou serviço de e-mail
  };

  return (
    <Layout>
      <section className="flex flex-col items-center justify-center min-h-[60vh] w-full text-center px-4">
        <Title variant="h1" className="mb-4">
          Fale com a gente
        </Title>
        <Label as="p" className="mb-8 text-lg max-w-2xl mx-auto">
          Tem dúvidas, sugestões ou quer falar com nosso time? Preencha o formulário ou utilize
          nossos canais de atendimento.
        </Label>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-lg mb-8 bg-white dark:bg-gray-900 rounded-xl shadow p-8 text-left"
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
            label="Mensagem"
            as="textarea"
            rows={4}
            value={mensagem}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMensagem(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Enviar mensagem
          </Button>
          {enviado && (
            <Label as="p" className="text-green-600 mt-2">
              Mensagem enviada com sucesso!
            </Label>
          )}
        </form>
        <div className="w-full max-w-lg mx-auto text-left bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow">
          <Title variant="h4" className="mb-2">
            Outros canais
          </Title>
          <Label as="p" className="mb-1">
            Telefone:{' '}
            <a href="tel:+5548999999999" className="text-primary">
              (48) 99999-9999
            </a>
          </Label>
          <Label as="p" className="mb-1">
            E-mail:{' '}
            <a href="mailto:contato@fastfood.com" className="text-primary">
              contato@fastfood.com
            </a>
          </Label>
          <Label as="p">Endereço: Rua Exemplo, 123 - Centro, Florianópolis/SC</Label>
        </div>
      </section>
    </Layout>
  );
};

export default Contato;
