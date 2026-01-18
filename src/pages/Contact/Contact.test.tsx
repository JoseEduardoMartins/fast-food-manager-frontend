import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Contact from './Contact';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render contact form', () => {
    renderWithRouter(<Contact />);
    expect(screen.getByText(/fale com a gente/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mensagem/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar mensagem/i })).toBeInTheDocument();
  });

  it('should render contact information', () => {
    renderWithRouter(<Contact />);
    expect(screen.getByText(/outros canais/i)).toBeInTheDocument();
    expect(screen.getByText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByText(/endereço/i)).toBeInTheDocument();
  });

  it('should show success message when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Contact />);

    const nameInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/e-mail/i);
    const messageInput = screen.getByLabelText(/mensagem/i);
    const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(messageInput, 'Test message');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/mensagem enviada com sucesso!/i)).toBeInTheDocument();
    });
  });
});
