import React, { useState } from 'react';
import { Layout, Title, Label, Input, Select, Button } from '@fast-food/design-system';

const plans = [
  {
    name: 'preta',
    label: 'Preta',
    limits: {
      company: 1,
      branch: 2,
      manager: 2,
      cook: 4,
      attendant: 4,
      menu: 1,
      menuCategory: '∞',
      product: '∞',
      ingredient: '∞',
    },
  },
  {
    name: 'ouro',
    label: 'Ouro',
    limits: {
      company: 2,
      branch: 4,
      manager: 4,
      cook: 8,
      attendant: 8,
      menu: 2,
      menuCategory: '∞',
      product: '∞',
      ingredient: '∞',
    },
  },
  {
    name: 'diamante',
    label: 'Diamante',
    limits: {
      company: 3,
      branch: 6,
      manager: 6,
      cook: 12,
      attendant: 12,
      menu: 3,
      menuCategory: '∞',
      product: '∞',
      ingredient: '∞',
    },
  },
];

const OwnerRegister: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('preta');
  const [taxId, setTaxId] = useState('');
  const [phone, setPhone] = useState('');

  const plan = plans.find((p) => p.name === selectedPlan)!;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aqui vai a lógica de cadastro
    alert(`Plano: ${selectedPlan}\nCPF: ${taxId}\nTelefone: ${phone}`);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4 py-12">
        <div className="w-full max-w-lg">
          <Title variant="h1" className="mb-3 text-center text-foreground font-semibold">
            Cadastro de Owner
          </Title>
          <Label as="p" className="mb-8 text-center text-gray-600 dark:text-gray-400">
            Escolha seu plano e preencha os dados para começar
          </Label>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 w-full bg-background border border-border rounded-2xl p-8"
          >
            <Select
              label="Plano"
              value={selectedPlan}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPlan(e.target.value)}
            >
              {plans.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.label}
                </option>
              ))}
            </Select>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-border">
              <Title variant="h4" className="mb-4 text-foreground font-semibold">
                Limites do Plano
              </Title>
              <ul className="space-y-2 pl-4">
                <Label as="li" className="text-gray-600 dark:text-gray-400">
                  Empresa: {plan.limits.company}
                </Label>
                <Label as="li" className="text-gray-600 dark:text-gray-400">
                  Filiais: {plan.limits.branch}
                </Label>
                <Label as="li" className="text-gray-600 dark:text-gray-400">
                  Gerentes: {plan.limits.manager}
                </Label>
                <Label as="li" className="text-gray-600 dark:text-gray-400">
                  Cozinheiros: {plan.limits.cook}
                </Label>
                <Label as="li" className="text-gray-600 dark:text-gray-400">
                  Atendentes: {plan.limits.attendant}
                </Label>
                <Label as="li" className="text-gray-600 dark:text-gray-400">
                  Cardápios: {plan.limits.menu}
                </Label>
                <Label as="li" className="text-gray-600 dark:text-gray-400">
                  Categorias de Menu: {plan.limits.menuCategory}
                </Label>
                <Label as="li" className="text-gray-600 dark:text-gray-400">
                  Produtos: {plan.limits.product}
                </Label>
                <Label as="li" className="text-gray-600 dark:text-gray-400">
                  Ingredientes: {plan.limits.ingredient}
                </Label>
              </ul>
            </div>
            <Input
              label="CPF"
              placeholder="Digite o CPF"
              value={taxId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaxId(e.target.value)}
              required
            />
            <Input
              label="Telefone"
              placeholder="Digite o telefone"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              required
            />
            <Button type="submit" className="w-full mt-2">
              Cadastrar
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default OwnerRegister;
