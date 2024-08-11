import MimesWeep from './mimesWeep';
import { render, screen } from '@testing-library/react';

test('renders learn react link', () => {
  render(<MimesWeep />);
  const linkElement = screen.getByText(/M I M E S W E E P/i);
  expect(linkElement).toBeInTheDocument();
});
