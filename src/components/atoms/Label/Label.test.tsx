import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Label from './Label';

describe('Label', () => {
  it('renders as label by default', () => {
    render(<Label>Label text</Label>);
    expect(screen.getByText('Label text')).toBeInTheDocument();
  });

  it('renders as paragraph when as="p"', () => {
    render(<Label as="p">Paragraph text</Label>);
    const element = screen.getByText('Paragraph text');
    expect(element.tagName).toBe('P');
  });
});
