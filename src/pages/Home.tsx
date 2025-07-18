import React from 'react';

const Home: React.FC = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <header
      style={{
        padding: '1.5rem 0',
        background: 'var(--color-primary, #f8b400)',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <h1>Fast Food Manager</h1>
      <nav>{/* Aqui pode entrar um menu futuramente */}</nav>
    </header>

    <main style={{ flex: 1, maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
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
    </main>

    <footer style={{ padding: '1rem 0', background: '#222', color: '#fff', textAlign: 'center' }}>
      &copy; {new Date().getFullYear()} Fast Food Manager. Todos os direitos reservados.
    </footer>
  </div>
);

export default Home;
