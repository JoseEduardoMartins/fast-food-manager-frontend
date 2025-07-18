import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@fast-food/design-system';

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Layout
      headerProps={{
        onNavigate: (route: string) => navigate(route),
      }}
    >
      <h2>Bem-vindo!</h2>
      <p>
        O <strong>Fast Food Manager</strong> é uma plataforma completa para gerenciamento de
        empresas do ramo alimentício. Controle usuários, pedidos, produtos, ingredientes, estoque e
        muito mais, de forma simples e eficiente.
      </p>
      <h3>Principais funcionalidades:</h3>
      <ul>
        <li>Gerenciamento de usuários (admin, owner, manager, cook, attendant, customer)</li>
        <li>Gestão de pedidos, produtos e ingredientes</li>
        <li>Controle de estoque</li>
        <li>Pedidos online e totem de autoatendimento</li>
        <li>Ambiente visual moderno e intuitivo</li>
      </ul>
      <p>Explore o menu para acessar as áreas de gestão conforme seu perfil de acesso.</p>
    </Layout>
  );
};

export default Home;
