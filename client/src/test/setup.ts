import '@testing-library/jest-dom';
import { vi } from 'vitest';

export const toApiMock = vi.fn((p: string) => `/api${p}`);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: vi.fn() },
  }),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('../../lib/toApi', () => ({
  toApi: (p: string) => toApiMock(p),
}));
