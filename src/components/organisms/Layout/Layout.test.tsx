import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Layout from './Layout';

describe('Layout', () => {
  it('renders correctly with children', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders with header when headerProps provided', () => {
    const onNavigate = vi.fn();
    render(
      <Layout headerProps={{ onNavigate }}>
        <div>Content</div>
      </Layout>
    );
    expect(screen.getByText('Fast Food Manager')).toBeInTheDocument();
  });

  it('does not render header when headerProps is null', () => {
    render(
      <Layout headerProps={null}>
        <div>Content</div>
      </Layout>
    );
    expect(screen.queryByText('Fast Food Manager')).not.toBeInTheDocument();
  });
});
