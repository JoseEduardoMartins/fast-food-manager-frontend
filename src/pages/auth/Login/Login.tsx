import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Title, Label } from '@components';
import { useAuth } from '@contexts';
import { ROUTES } from '@common/constants';
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
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn({
        email: data.email,
        password: data.password,
      });
      // Redirection is handled by AuthContext
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao fazer login. Tente novamente.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-12">
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
          {error && (
            <Label as="p" className="text-error mt-2 text-sm">
              {error}
            </Label>
          )}
          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => navigate(ROUTES.REGISTER)}
        >
          Criar conta
        </Button>
      </div>
    </div>
  );
};

export default Login;
