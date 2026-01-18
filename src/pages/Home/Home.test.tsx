import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the main heading', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/gerencie seu restaurante/i)).toBeInTheDocument();
  });

  it('should render hero section with call-to-action buttons', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/teste grátis!/i)).toBeInTheDocument();
    expect(screen.getByText(/comece agora/i)).toBeInTheDocument();
    expect(screen.getByText(/saiba mais/i)).toBeInTheDocument();
  });

  it('should render benefits section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/gestão completa/i)).toBeInTheDocument();
    expect(screen.getByText(/interface moderna/i)).toBeInTheDocument();
    expect(screen.getByText(/planos flexíveis/i)).toBeInTheDocument();
  });

  it('should render features section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/recursos que fazem a diferença/i)).toBeInTheDocument();
    expect(screen.getByText(/gestão de usuários/i)).toBeInTheDocument();
    expect(screen.getByText(/pedidos em tempo real/i)).toBeInTheDocument();
    expect(screen.getByText(/relatórios inteligentes/i)).toBeInTheDocument();
    expect(screen.getByText(/integração completa/i)).toBeInTheDocument();
  });

  it('should render final CTA section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/pronto para transformar seu negócio\?/i)).toBeInTheDocument();
    expect(screen.getAllByText(/teste grátis agora/i).length).toBeGreaterThan(0);
  });
});
