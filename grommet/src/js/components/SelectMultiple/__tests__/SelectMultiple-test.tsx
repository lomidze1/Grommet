import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import 'regenerator-runtime/runtime';
import 'jest-styled-components';
import '@testing-library/jest-dom';
import { createPortal, expectPortal } from '../../../utils/portal';

import { Grommet } from '../..';
import { Box } from '../../Box';
import { Text } from '../../Text';
import { SelectMultiple } from '..';

describe('SelectMultiple', () => {
  window.scrollTo = jest.fn();
  beforeEach(createPortal);
  test('should not have accessibility violations', async () => {
    const { container } = render(
      <Grommet>
        <SelectMultiple options={['one', 'two', 'three']} a11yTitle="test" />
      </Grommet>,
    );
    const results = await axe(container, {
      rules: {
        /* This rule is flagged because Select is built using a
        TextInput within a DropButton. According to Dequeue and
        WCAG 4.1.2 "interactive controls must not have focusable
        descendants". Jest-axe is assuming that the input is focusable
        and since the input is a descendant of the button the rule is
        flagged. However, the TextInput is built so that it is read
        only and cannot receive focus. Select is accessible
        according to the WCAG specification, but jest-axe is flagging
        it so we are disabling this rule. */
        'nested-interactive': { enabled: false },
      },
    });
    expect(container.firstChild).toMatchSnapshot();
    expect(results).toHaveNoViolations();
  });

  test('defaultValue', () => {
    const { container } = render(
      <Grommet>
        <SelectMultiple options={['one', 'two']} defaultValue={['one']} />,
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('children', () => {
    const { container } = render(
      <Grommet>
        <SelectMultiple options={[{ test: 'one' }, { test: 'two' }]}>
          {(option) => <span>{option.test}</span>}
        </SelectMultiple>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('placeholder', () => {
    const { container } = render(
      <Grommet>
        <SelectMultiple
          help={<Text>help text</Text>}
          options={[{ test: 'one' }, { test: 'two' }]}
          placeholder="placeholder text"
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('disabled', async () => {
    const { container } = render(
      <Grommet>
        <SelectMultiple options={[1, 2]} disabled />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('disabled option', async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    const user = userEvent.setup();
    render(
      <Grommet>
        <SelectMultiple
          id="test-select__drop"
          options={[0, 1, 2]}
          disabled={[1]}
          sortSelectedOnClose
        />
      </Grommet>,
    );
    // open SelectMultiple
    await user.click(screen.getByRole('button', { name: /Open Drop/i }));
    // try to click all the options
    await user.click(screen.getByRole('option', { name: /0/i }));
    await user.click(screen.getByRole('option', { name: /1/i }));
    await user.click(screen.getByRole('option', { name: /2/i }));

    // only 2 options should be selected (0 and 2)
    expectPortal('test-select__drop').toMatchSnapshot();
  });

  test('limit', async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    const user = userEvent.setup();
    render(
      <Grommet>
        <SelectMultiple id="test-select__drop" options={[0, 1, 2]} limit={2} />
      </Grommet>,
    );
    // open SelectMultiple
    await user.click(screen.getByRole('button', { name: /Open Drop/i }));
    // select 2 options
    await user.click(screen.getByRole('option', { name: /0/i }));
    await user.click(screen.getByRole('option', { name: /1/i }));
    await user.click(screen.getByRole('option', { name: /2/i }));

    // option 2 should be disabled
    expectPortal('test-select__drop').toMatchSnapshot();
  });

  test('showSelectionInline', async () => {
    // Mock scrollIntoView since JSDOM doesn't do layout.
    // https://github.com/jsdom/jsdom/issues/1695#issuecomment-449931788
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    const user = userEvent.setup();
    const open = jest.fn();
    const close = jest.fn();
    const { container } = render(
      <Grommet>
        <SelectMultiple
          onOpen={open}
          onClose={close}
          options={[0, 1, 2]}
          showSelectedInline
        />
      </Grommet>,
    );
    // open SelectMultiple
    await user.click(screen.getByRole('button', { name: /Open Drop/i }));
    expect(open).toHaveBeenCalled();

    // click all the options
    await user.click(screen.getByRole('option', { name: /0/i }));
    await user.click(screen.getByRole('option', { name: /1/i }));
    await user.click(screen.getByRole('option', { name: /2/i }));

    // close SelectMultiple
    await user.click(screen.getByRole('button', { name: /Close Select/i }));
    expect(close).toHaveBeenCalled();

    // all options should be visible when drop is closed
    expect(container.firstChild).toMatchSnapshot();
  });

  test('showSelectionInline with children', async () => {
    // Mock scrollIntoView since JSDOM doesn't do layout.
    // https://github.com/jsdom/jsdom/issues/1695#issuecomment-449931788
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Grommet>
        <SelectMultiple options={[0, 1, 2]} showSelectedInline>
          {(option, state) => (
            <Box pad="small" background={state.active ? 'active' : undefined}>
              {option}
            </Box>
          )}
        </SelectMultiple>
      </Grommet>,
    );
    // open SelectMultiple
    await user.click(screen.getByRole('button', { name: /Open Drop/i }));
    // click all the options
    await user.click(screen.getByRole('option', { name: /0/i }));
    await user.click(screen.getByRole('option', { name: /1/i }));
    await user.click(screen.getByRole('option', { name: /2/i }));
    // close SelectMultiple
    await user.click(screen.getByRole('button', { name: /Close Select/i }));
    // all options should be visible when drop is closed
    expect(container.firstChild).toMatchSnapshot();
    // unselect option at input level
    await user.click(screen.getByRole('option', { name: /0/i }));
    await user.click(screen.getByRole('option', { name: /2/i }));
    await user.click(screen.getByRole('option', { name: /1/i }));
    // options should no longer be visible after unselecting them
    expect(container.firstChild).toMatchSnapshot();
  });

  test('showSelectionInline with disabled options', () => {
    // Mock scrollIntoView since JSDOM doesn't do layout.
    // https://github.com/jsdom/jsdom/issues/1695#issuecomment-449931788
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    const { container } = render(
      <Grommet>
        <SelectMultiple
          options={['one', 'two', 'three']}
          disabled={['one']}
          value={['one']}
          showSelectedInline
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('keyboard interactions', async () => {
    // Mock scrollIntoView since JSDOM doesn't do layout.
    // https://github.com/jsdom/jsdom/issues/1695#issuecomment-449931788
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Grommet>
        <SelectMultiple options={['one', 'two', 'three', 'four']} limit={2} />
      </Grommet>,
    );

    await user.click(screen.getByRole('button', { name: /Open Drop/i }));
    const input = screen.getByRole('listbox');
    fireEvent.keyDown(input, { keyCode: 40 }); // down
    fireEvent.keyDown(input, { keyCode: 13 }); // enter
    fireEvent.keyDown(input, { keyCode: 40 }); // down
    fireEvent.keyDown(input, { keyCode: 40 }); // down
    fireEvent.keyDown(input, { keyCode: 38 }); // up
    fireEvent.keyDown(input, { keyCode: 13 }); // enter

    expect(container.firstChild).toMatchSnapshot();
  });

  test('valueKey and labelKey', () => {
    const { container } = render(
      <Grommet>
        <SelectMultiple
          showSelectedInline
          options={[
            { value: 'one', label: 'a' },
            { value: 'two', label: 'b' },
          ]}
          valueKey={{
            key: 'value',
            reduce: true,
          }}
          labelKey="label"
          value={['one']}
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('search', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(
      <Grommet>
        <SelectMultiple
          showSelectedInline
          options={['one', 'two', 'three', 'four']}
          onSearch={onSearch}
          limit={1}
        />
      </Grommet>,
    );

    await user.click(screen.getByRole('button', { name: /Open Drop/i }));
    const input = screen.getByRole('searchbox');
    await user.type(input, 'th');

    expect(onSearch).toBeCalledWith(expect.stringMatching(/^th/));
  });

  test('select all and clear', async () => {
    const user = userEvent.setup();
    render(
      <Grommet>
        <SelectMultiple
          id="test-select__drop"
          options={['one', 'two', 'three', 'four']}
        />
      </Grommet>,
    );

    await user.click(screen.getByRole('button', { name: /Open Drop/i }));
    await user.click(screen.getByRole('button', { name: /Select All/i }));

    expectPortal('test-select__drop').toMatchSnapshot();

    await user.click(screen.getByRole('button', { name: /Clear All/i }));

    expectPortal('test-select__drop').toMatchSnapshot();
  });

  test('null value', () => {
    const { asFragment } = render(
      <Grommet>
        {/* @ts-expect-error */}
        <SelectMultiple options={['a', 'b']} value={null} />
      </Grommet>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test('object value', () => {
    render(
      <Grommet>
        <SelectMultiple
          showSelectedInline
          options={[
            { label: 'a', value: 1 },
            { label: 'b', value: 2 },
          ]}
          labelKey="label"
          valueKey="value"
          value={[{ label: 'a', value: 1 }]}
        />
      </Grommet>,
    );
    expect(screen.getByRole('option', { name: /a selected/ })).toBeVisible();
  });
});
