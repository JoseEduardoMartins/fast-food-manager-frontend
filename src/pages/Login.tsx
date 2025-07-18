import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Layout } from '@fast-food/design-system';

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

  const onSubmit = (data: LoginData) => {
    // Aqui vai a lógica de autenticação futura
    alert('Login simulado!');
    navigate('/');
  };

  return (
    <Layout
      headerProps={{
        onNavigate: (route: string) => navigate(route),
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Login</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxWidth: 400,
          margin: '0 auto',
        }}
        noValidate
      >
        <Input
          label="E-mail"
          type="email"
          {...register('email')}
          placeholder="Digite seu e-mail"
          style={{ width: '100%' }}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <Input
          label="Senha"
          type="password"
          {...register('password')}
          placeholder="Digite sua senha"
          style={{ width: '100%' }}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button type="submit" style={{ width: '100%' }}>
          Entrar
        </Button>
      </form>
    </Layout>
  );
};

export default Login;
