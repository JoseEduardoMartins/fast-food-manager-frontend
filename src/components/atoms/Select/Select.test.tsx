import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Select from './Select';

describe('Select', () => {
  it('renders correctly', () => {
    render(
      <Select>
        <option value="1">Option 1</option>
      </Select>
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    render(
      <Select label="Choose option">
        <option value="1">Option 1</option>
      </Select>
    );
    expect(screen.getByText('Choose option')).toBeInTheDocument();
  });
});
