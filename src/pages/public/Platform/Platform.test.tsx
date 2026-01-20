import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Platform from './Platform';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Platform', () => {
  it('should render platform heading', () => {
    renderWithRouter(<Platform />);
    expect(screen.getByText(/a plataforma completa para o seu negócio/i)).toBeInTheDocument();
  });

  it('should render all features', () => {
    renderWithRouter(<Platform />);
    expect(screen.getByText(/gestão de usuários/i)).toBeInTheDocument();
    expect(screen.getByText(/pedidos e estoque/i)).toBeInTheDocument();
    expect(screen.getByText(/relatórios inteligentes/i)).toBeInTheDocument();
    expect(screen.getByText(/integração com totem/i)).toBeInTheDocument();
    expect(screen.getByText(/gestão de cardápio/i)).toBeInTheDocument();
    expect(screen.getByText(/multi-empresa e multi-filial/i)).toBeInTheDocument();
  });

  it('should render demo button', () => {
    renderWithRouter(<Platform />);
    expect(screen.getByRole('button', { name: /solicite uma demonstração/i })).toBeInTheDocument();
  });
});
