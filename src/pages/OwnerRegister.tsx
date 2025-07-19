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
      <Title variant="h2" style={{ marginBottom: 24 }}>
        Cadastro de Owner
      </Title>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 480,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
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
        <div
          style={{
            background: '#f8fafc',
            borderRadius: 8,
            padding: 16,
            border: '1px solid #e2e8f0',
          }}
        >
          <Title variant="h4" style={{ marginBottom: 8 }}>
            Limites do Plano
          </Title>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            <Label as="li">Empresa: {plan.limits.company}</Label>
            <Label as="li">Filiais: {plan.limits.branch}</Label>
            <Label as="li">Gerentes: {plan.limits.manager}</Label>
            <Label as="li">Cozinheiros: {plan.limits.cook}</Label>
            <Label as="li">Atendentes: {plan.limits.attendant}</Label>
            <Label as="li">Cardápios: {plan.limits.menu}</Label>
            <Label as="li">Categorias de Menu: {plan.limits.menuCategory}</Label>
            <Label as="li">Produtos: {plan.limits.product}</Label>
            <Label as="li">Ingredientes: {plan.limits.ingredient}</Label>
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
        <Button type="submit" style={{ width: '100%' }}>
          Cadastrar
        </Button>
      </form>
    </Layout>
  );
};

export default OwnerRegister;
