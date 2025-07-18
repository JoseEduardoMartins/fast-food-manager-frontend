import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from './Home';

describe('Home', () => {
  it('deve exibir o cabeçalho e a introdução', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /fast food manager/i })).toBeTruthy();
    expect(screen.getByText(/plataforma completa para gerenciamento de empresas/i)).toBeTruthy();
  });
});
