import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Careers from './Careers';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Careers', () => {
  it('should render careers heading', () => {
    renderWithRouter(<Careers />);
    expect(screen.getByText(/trabalhe com a gente/i)).toBeInTheDocument();
  });

  it('should render all benefits', () => {
    renderWithRouter(<Careers />);
    expect(screen.getByText(/ambiente colaborativo/i)).toBeInTheDocument();
    expect(screen.getByText(/crescimento profissional/i)).toBeInTheDocument();
    expect(screen.getByText(/flexibilidade/i)).toBeInTheDocument();
  });

  it('should render open positions section', () => {
    renderWithRouter(<Careers />);
    expect(screen.getByText(/vagas em aberto/i)).toBeInTheDocument();
  });

  it('should render all job positions', () => {
    renderWithRouter(<Careers />);
    expect(screen.getByText(/desenvolvedor\(a\) frontend/i)).toBeInTheDocument();
    expect(screen.getByText(/product owner/i)).toBeInTheDocument();
    expect(screen.getByText(/designer ui\/ux/i)).toBeInTheDocument();
  });

  it('should render apply buttons for each job', () => {
    renderWithRouter(<Careers />);
    const applyButtons = screen.getAllByRole('button', { name: /candidatar-se/i });
    expect(applyButtons.length).toBe(3);
  });
});
