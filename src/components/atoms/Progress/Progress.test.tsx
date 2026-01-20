import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Progress from './Progress';

describe('Progress', () => {
  it('renders correctly', () => {
    const { container } = render(<Progress value={50} />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('calculates percentage correctly', () => {
    const { container } = render(<Progress value={25} max={100} />);
    const progressBar = container.querySelector('div > div');
    expect(progressBar).toBeInTheDocument();
  });
});
