import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Layout, Title, Label } from '../../../components';
import { ROUTES } from '../../../common/constants';
import { loginSchema } from './Login.type';
import type { LoginData } from './Login.type';

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();

  const onSubmit = () => {
    // Authentication logic will go here
    alert('Login simulado!');
    navigate(ROUTES.HOME);
  };

  return (
    <Layout headerProps={{ onNavigate: (route) => navigate(route) }}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4 py-12">
        <div className="w-full max-w-md">
          <Title variant="h1" className="mb-3 text-center text-foreground font-semibold">
            Login
          </Title>
          <Label as="p" className="mb-8 text-center text-gray-600 dark:text-gray-400">
            Entre com suas credenciais para acessar a plataforma
          </Label>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-full bg-background border border-border rounded-2xl p-8 mb-6"
            noValidate
          >
            <Input
              label="E-mail"
              type="email"
              {...register('email')}
              placeholder="Digite seu e-mail"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <Input
              label="Senha"
              type="password"
              {...register('password')}
              placeholder="Digite sua senha"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button type="submit" className="w-full mt-2">
              Entrar
            </Button>
          </form>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate(ROUTES.OWNER_REGISTER)}
          >
            Cadastre-se como Owner
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
