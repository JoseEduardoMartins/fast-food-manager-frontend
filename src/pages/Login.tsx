import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Layout, Title } from '@fast-food/design-system';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido').nonempty('E-mail é obrigatório'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginData = z.infer<typeof loginSchema>;

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
    // Aqui vai a lógica de autenticação futura
    alert('Login simulado!');
    navigate('/');
  };

  return (
    <Layout headerProps={{ onNavigate: (route: string) => navigate(route) }}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        <Title variant="h1" className="mb-6 text-center">
          Login
        </Title>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full max-w-md"
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
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
        <Button
          variant="secondary"
          className="w-full max-w-md mt-6"
          onClick={() => navigate('/owner-register')}
        >
          Cadastre-se como Owner
        </Button>
      </div>
    </Layout>
  );
};

export default Login;
