import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Layout from './Layout';
import type { User } from '../../store/types';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Outlet content</div>,
  };
});

vi.mock('../Navbar/Navbar', () => ({ default: () => <div>MockNavbar</div> }));
vi.mock('../LanguageSelector/LanguageSelector', () => ({
  default: () => <div>MockLanguageSelector</div>,
}));
vi.mock('../Button/Button', () => ({
  default: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />,
}));

const logoutMock = vi.fn();
let mockUser: Partial<User> | null = null;
vi.mock('../../store/userStore', () => ({
  useUserStore: () => ({ logout: logoutMock, user: mockUser }),
}));

describe('Layout', () => {
  it('renders header, main, and footer', () => {
    render(<Layout />);
    expect(screen.getByText('Invoicify')).toBeInTheDocument();
    expect(screen.getByText('MockNavbar')).toBeInTheDocument();
    expect(screen.getByText('MockLanguageSelector')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toHaveTextContent('Outlet content');
    expect(screen.getByText(/©/)).toBeInTheDocument();
  });

  it('does not show logout button if no user is logged in', () => {
    mockUser = null;
    render(<Layout />);
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });

  it('shows logout button if user is logged in and calls logout on click', () => {
    mockUser = { id: '1', name: 'Ferhat' };
    render(<Layout />);
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toBeInTheDocument();
    button.click();
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
