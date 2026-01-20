import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Divider from './Divider';

describe('Divider', () => {
  it('renders correctly', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('applies horizontal orientation by default', () => {
    const { container } = render(<Divider />);
    const hr = container.querySelector('hr');
    expect(hr).toHaveClass('w-full');
  });

  it('applies vertical orientation correctly', () => {
    const { container } = render(<Divider orientation="vertical" />);
    const hr = container.querySelector('hr');
    expect(hr).toHaveClass('h-full');
  });
});
