import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';

describe('Header', () => {
  it('renders correctly', () => {
    const onNavigate = vi.fn();
    render(<Header onNavigate={onNavigate} />);
    expect(screen.getByText('Fast Food Manager')).toBeInTheDocument();
  });

  it('calls onNavigate when clicking links', () => {
    const onNavigate = vi.fn();
    render(<Header onNavigate={onNavigate} />);
    const platformLink = screen.getByText('Plataforma');
    platformLink.click();
    expect(onNavigate).toHaveBeenCalledWith('/platform');
  });
});
