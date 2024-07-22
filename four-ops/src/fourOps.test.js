import { render, screen } from '@testing-library/react';
import FourOps from './fourOps';

test('renders learn react link', () => {
  render(<FourOps />);
  const linkElement = screen.getByText(/F O U R - O P S/i);
  expect(linkElement).toBeInTheDocument();
});
