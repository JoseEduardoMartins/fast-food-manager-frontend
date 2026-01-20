import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import OwnerRegister from './OwnerRegister';

// Mock window.alert
const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('OwnerRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAlert.mockClear();
  });

  it('should render owner register form', () => {
    renderWithRouter(<OwnerRegister />);
    expect(screen.getByText(/cadastro de owner/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/plano/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
  });

  it('should display plan limits section', () => {
    renderWithRouter(<OwnerRegister />);
    expect(screen.getByText(/limites do plano/i)).toBeInTheDocument();
    expect(screen.getByText(/empresa:/i)).toBeInTheDocument();
    expect(screen.getByText(/filiais:/i)).toBeInTheDocument();
  });

  it('should update plan limits when plan is changed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<OwnerRegister />);

    const planSelect = screen.getByLabelText(/plano/i);
    await user.selectOptions(planSelect, 'ouro');

    expect(screen.getByText(/empresa: 2/i)).toBeInTheDocument();
  });

  it('should submit form with plan data', async () => {
    const user = userEvent.setup();
    renderWithRouter(<OwnerRegister />);

    const cpfInput = screen.getByLabelText(/cpf/i);
    const phoneInput = screen.getByLabelText(/telefone/i);
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });

    await user.type(cpfInput, '12345678900');
    await user.type(phoneInput, '48999999999');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalled();
    });
  });
});
