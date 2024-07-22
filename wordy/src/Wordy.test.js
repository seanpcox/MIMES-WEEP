import { render, screen } from '@testing-library/react';
import Wordy from './Wordy';

test('renders learn react link', () => {
  render(<Wordy />);
  const linkElement = screen.getByText(/W O R D Y/i);
  expect(linkElement).toBeInTheDocument();
});
