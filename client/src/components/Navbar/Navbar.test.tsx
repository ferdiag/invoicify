import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from './Navbar';
import type { User } from '../../store/types';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

let mockUser: Partial<User> | null = null;
vi.mock('../../store/userStore', () => ({
  useUserStore: () => ({ user: mockUser }),
}));

beforeEach(() => {
  navigateMock.mockClear();
  mockUser = null;
});

describe('Navbar', () => {
  it('renders Home and Auth when no user is logged in', () => {
    render(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Auth')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('renders Home and Dashboard when a user is logged in', () => {
    mockUser = { id: ' 1', name: 'Ferhat' };
    render(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Auth')).not.toBeInTheDocument();
  });

  it('navigates to the correct route when a link is clicked', async () => {
    render(<Navbar />);
    const link = screen.getByText('Home');
    await userEvent.click(link);
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('prevents default link behavior', async () => {
    render(<Navbar />);
    const link = screen.getByText('Auth');

    await userEvent.click(link);

    expect(navigateMock).toHaveBeenCalledWith('/auth');
  });
});
