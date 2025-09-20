import '@testing-library/jest-dom';
import { vi, type MockedFunction } from 'vitest';
import type { UserStoreType } from '../store/types';
import { afterEach } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: vi.fn() },
  }),
}));

export const useNavigateMock = vi.fn();
export const mockParams: Record<string, string | undefined> = {};

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => useNavigateMock,
    useParams: () => mockParams,
  };
});

export const toApiMock = vi.fn((p: string) => `/api${p}`);
vi.mock('../../lib/toApi', () => ({
  toApi: (p: string) => toApiMock(p),
}));

type UseUserStore = () => UserStoreType;
export const useUserStoreMock: MockedFunction<UseUserStore> = vi.fn();
vi.mock('../store/userStore', () => ({ useUserStore: () => useUserStoreMock() }));

afterEach(() => {
  vi.clearAllMocks();
  // wichtig, sonst bleiben gesetzte Params zwischen Tests bestehen
  for (const key in mockParams) {
    delete mockParams[key];
  }
});
