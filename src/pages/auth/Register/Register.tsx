import React, { useState } from 'react';
import { Title, Label, Input, Button, Select } from '@components';
import { USER_TYPES, USER_TYPE_LABELS, PLANS, DEFAULT_PLAN } from '@common/constants';
import type { UserType, PlanName } from '@common/constants';

const Register: React.FC = () => {
  const [userType, setUserType] = useState<UserType>(USER_TYPES.CUSTOMER);
  const [selectedPlan, setSelectedPlan] = useState<PlanName>(DEFAULT_PLAN);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [taxId, setTaxId] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const isOwner = userType === USER_TYPES.OWNER;
  const selectedPlanData = PLANS.find((p) => p.name === selectedPlan)!;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (isOwner && !taxId) {
      setError('CPF é obrigatório para proprietários.');
      return;
    }

    if (isOwner && !phone) {
      setError('Telefone é obrigatório para proprietários.');
      return;
    }

    setSubmitted(true);
    // Integration with backend can be done here
    console.log({
      userType,
      plan: isOwner ? selectedPlan : undefined,
      name,
      email,
      taxId: isOwner ? taxId : undefined,
      phone: isOwner ? phone : undefined,
    });
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen w-full text-center px-4 py-12">
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
        <Select
          label="Tipo de usuário"
          value={userType}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setUserType(e.target.value as UserType);
            if (e.target.value === USER_TYPES.CUSTOMER) {
              setTaxId('');
              setPhone('');
            }
          }}
        >
          <option value={USER_TYPES.CUSTOMER}>{USER_TYPE_LABELS[USER_TYPES.CUSTOMER]}</option>
          <option value={USER_TYPES.OWNER}>{USER_TYPE_LABELS[USER_TYPES.OWNER]}</option>
        </Select>

        {isOwner && (
          <>
            <Select
              label="Plano"
              value={selectedPlan}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedPlan(e.target.value as PlanName)
              }
            >
              {PLANS.map((plan) => (
                <option key={plan.name} value={plan.name}>
                  {plan.label}
                </option>
              ))}
            </Select>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-border">
              <Title variant="h4" className="mb-4 text-foreground font-semibold">
                Limites do Plano {selectedPlanData.label}
              </Title>
              <ul className="space-y-2 pl-4">
                <li className="text-gray-600 dark:text-gray-400">
                  Empresa: {selectedPlanData.limits.company}
                </li>
                <li className="text-gray-600 dark:text-gray-400">
                  Filiais: {selectedPlanData.limits.branch}
                </li>
                <li className="text-gray-600 dark:text-gray-400">
                  Gerentes: {selectedPlanData.limits.manager}
                </li>
                <li className="text-gray-600 dark:text-gray-400">
                  Cozinheiros: {selectedPlanData.limits.cook}
                </li>
                <li className="text-gray-600 dark:text-gray-400">
                  Atendentes: {selectedPlanData.limits.attendant}
                </li>
                <li className="text-gray-600 dark:text-gray-400">
                  Cardápios: {selectedPlanData.limits.menu}
                </li>
                <li className="text-gray-600 dark:text-gray-400">
                  Categorias de Menu: {selectedPlanData.limits.menuCategory}
                </li>
                <li className="text-gray-600 dark:text-gray-400">
                  Produtos: {selectedPlanData.limits.product}
                </li>
                <li className="text-gray-600 dark:text-gray-400">
                  Ingredientes: {selectedPlanData.limits.ingredient}
                </li>
              </ul>
            </div>
          </>
        )}

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

        {isOwner && (
          <>
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
          </>
        )}

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
  );
};

export default Register;
