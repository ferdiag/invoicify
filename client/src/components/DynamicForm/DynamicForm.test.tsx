import type { ButtonHTMLAttributes, Dispatch, InputHTMLAttributes, SetStateAction } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import DynamicForm from './DynamicForm';
import type { Field } from '../../store/types';

vi.mock('../Button/Button', () => ({
  default: (props: ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />,
}));

vi.mock('../Input', () => ({
  default: (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

type FormState = Record<string, unknown>;

const fields = [
  { id: 'name', label: 'Name', placeholder: 'Firma', value: '' },
  { id: 'email', label: 'E-Mail', placeholder: 'name@domain.de', value: 'test@example.com' },
] as const;

describe('DynamicForm', () => {
  it('rendert Titel, Felder und Submit-Button', () => {
    const setState: Dispatch<SetStateAction<FormState>> = vi.fn();
    const onSubmit = vi.fn();

    render(
      <DynamicForm
        title="Neuer Kunde"
        fields={fields as unknown as Field[]}
        setState={setState}
        onSubmit={onSubmit}
        submitLabel="Speichern"
      />,
    );

    expect(screen.getByRole('heading', { name: 'Neuer Kunde' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();

    const email = screen.getByLabelText<HTMLInputElement>('E-Mail');
    expect(email).toHaveValue('test@example.com');

    expect(screen.getByPlaceholderText('Firma')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Speichern' })).toBeInTheDocument();
  });

  it('calls setState with merged values when a field changes', () => {
    let capturedUpdater: ((prev: FormState) => FormState) | undefined;
    const setState: Dispatch<SetStateAction<FormState>> = vi.fn(
      (arg: SetStateAction<FormState>) => {
        if (typeof arg === 'function') {
          capturedUpdater = arg as (prev: FormState) => FormState;
        }
      },
    );

    render(
      <DynamicForm
        title="Neuer Kunde"
        fields={[{ id: 'name', label: 'Name', placeholder: 'Firma', value: '' }]}
        setState={setState}
        onSubmit={vi.fn()}
        submitLabel="Speichern"
      />,
    );

    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Muster GmbH' } });

    expect(setState).toHaveBeenCalled();
    expect(typeof capturedUpdater).toBe('function');

    const next = capturedUpdater?.({ existing: 'x' });
    expect(next).toEqual({ existing: 'x', name: 'Muster GmbH' });
  });

  it('calls onSubmit when the button is clicked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const setState: Dispatch<SetStateAction<FormState>> = vi.fn();

    render(
      <DynamicForm
        title="Neuer Kunde"
        fields={fields as unknown as Field[]}
        setState={setState}
        onSubmit={onSubmit}
        submitLabel="Speichern"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Speichern' }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('rendert keinen Titel, wenn keiner übergeben wird', () => {
    const setState: Dispatch<SetStateAction<FormState>> = vi.fn();

    const { queryByRole } = render(
      <DynamicForm
        title={undefined}
        fields={fields as unknown as Field[]}
        setState={setState}
        onSubmit={vi.fn()}
        submitLabel="Speichern"
      />,
    );

    expect(queryByRole('heading')).toBeNull();
  });
});
