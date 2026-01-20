import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Textarea from './Textarea';

describe('Textarea', () => {
  it('renders correctly', () => {
    render(<Textarea placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });
});
