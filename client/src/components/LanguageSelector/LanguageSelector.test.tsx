import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// 🔒 Lokaler Mock, damit der Test unabhängig von setupTests.ts funktioniert
let changeLanguageMock: ReturnType<typeof vi.fn>;
let language = 'en';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: {
      language,
      changeLanguage: changeLanguageMock,
    },
  }),
}));

import LanguageSelector from './LanguageSelector';

beforeEach(() => {
  changeLanguageMock = vi.fn().mockResolvedValue(undefined);
  language = 'en';
});

describe('LanguageSelector', () => {
  it('renders label text und options', () => {
    render(<LanguageSelector />);

    expect(screen.getByText(/select language:/i)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Deutsch' })).toBeInTheDocument();
  });

  it('shows the currently set language (en)', () => {
    language = 'en';
    render(<LanguageSelector />);
    const select = screen.getByRole<HTMLSelectElement>('combobox'); // generischer Typ-Arg
    expect(select.value).toBe('en');
  });

  it('shows the currently set language (de)', () => {
    language = 'de';
    render(<LanguageSelector />);
    const select = screen.getByRole<HTMLSelectElement>('combobox');
    expect(select.value).toBe('de');
  });

  it('calls i18n.changeLanguage on change', async () => {
    render(<LanguageSelector />);
    const select = screen.getByRole('combobox');

    await userEvent.selectOptions(select, 'de');

    expect(changeLanguageMock).toHaveBeenCalledTimes(1);
    expect(changeLanguageMock).toHaveBeenCalledWith('de');
  });
});
