import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Dashboard', () => {
  it('should render dashboard heading', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText(/bem-vindo ao seu painel/i)).toBeInTheDocument();
  });

  it('should render all dashboard cards', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText(/pedidos do dia/i)).toBeInTheDocument();
    expect(screen.getByText(/faturamento/i)).toBeInTheDocument();
    expect(screen.getByText(/produtos em estoque/i)).toBeInTheDocument();
    expect(screen.getByText(/novos clientes/i)).toBeInTheDocument();
  });

  it('should display card values', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('27')).toBeInTheDocument();
    expect(screen.getByText('R$ 2.350,00')).toBeInTheDocument();
    expect(screen.getByText('134')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render reports button', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByRole('button', { name: /ver relatórios completos/i })).toBeInTheDocument();
  });
});
