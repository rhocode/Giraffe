import React from 'react';
import { cleanup, render } from 'react-testing-library';
import Page from './Page';

afterEach(cleanup);

describe('<Page/>', () => {
  test('displays Page content', () => {
    const { getByText } = render(<Page>Lorem ipsum</Page>);
    expect(getByText('Lorem ipsum')).toBeTruthy();
  });
});
