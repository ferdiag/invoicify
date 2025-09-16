import { render, screen } from '@testing-library/react';
import CTAButton from './Button';
import React from 'react';
import '@testing-library/jest-dom';

describe('CTAButton', () => {
  it('renders the button with children ', () => {
    render(React.createElement(CTAButton, null, 'test'));
    const btn = screen.getByRole('button', { name: 'test' });
    expect(btn).toBeInTheDocument();
  });
});
