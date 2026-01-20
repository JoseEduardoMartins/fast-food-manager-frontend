import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Title from './Title';

describe('Title', () => {
  it('renders h1 by default', () => {
    render(<Title>Title text</Title>);
    expect(screen.getByText('Title text').tagName).toBe('H1');
  });

  it('renders specified variant', () => {
    render(<Title variant="h2">Subtitle</Title>);
    expect(screen.getByText('Subtitle').tagName).toBe('H2');
  });
});
