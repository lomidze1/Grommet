import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';

import 'jest-styled-components';
import 'jest-axe/extend-expect';
import 'regenerator-runtime/runtime';

import { Grommet } from '../../Grommet';
import { Box } from '../../Box';
import { RadioButtonGroup } from '..';

describe('RadioButtonGroup', () => {
  test('should have no accessibility violations', async () => {
    const { container } = render(
      <Grommet>
        <RadioButtonGroup name="test" options={['option1']} />
      </Grommet>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
    expect(container).toMatchSnapshot();
  });

  test('string options', () => {
    const { container } = render(
      <Grommet>
        <RadioButtonGroup name="test" options={['one', 'two']} value="one" />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('number options', () => {
    const { container } = render(
      <Grommet>
        <RadioButtonGroup name="test" options={[1, 2]} value={1} />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('boolean options', () => {
    const { container } = render(
      <Grommet>
        <RadioButtonGroup name="test" options={[true, false]} value />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('object options just value', () => {
    const { container } = render(
      <Grommet>
        <RadioButtonGroup
          name="test"
          options={[{ value: 'one' }, { value: 'two' }]}
          value="two"
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('object options', () => {
    const { container } = render(
      <Grommet>
        <RadioButtonGroup
          name="test"
          options={[
            { id: 'onE', label: 'One', value: 'one' },
            { id: 'twO', label: 'Two', value: 'two' },
          ]}
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('object options disabled', () => {
    const { container } = render(
      <Grommet>
        <RadioButtonGroup
          name="test"
          options={[{ value: 'one', disabled: true }, { value: 'two' }]}
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('defaultValue', () => {
    const { container } = render(
      <Grommet>
        <RadioButtonGroup
          name="test"
          options={['one', 'two']}
          defaultValue="one"
        />
      </Grommet>,
    );

    expect(container).toMatchSnapshot();
  });

  test('children', () => {
    const child = ({ checked }) => (
      <Box pad="small" background={checked ? 'accent-1' : 'control'} />
    );
    const { container } = render(
      <Grommet>
        <RadioButtonGroup name="test" options={['one', 'two']} value="one">
          {child}
        </RadioButtonGroup>
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('adding additional props', () => {
    const { container } = render(
      <Grommet>
        <RadioButtonGroup
          name="test"
          options={[
            {
              id: 'ONE',
              value: '1',
              'data-testid': 'testid-1',
            },
            {
              id: 'TWO',
              value: '2',
              'data-testid': 'testid-2',
            },
          ]}
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('onChange fires with event when passed from props', () => {
    const radioGroupOptions = [
      {
        id: 'ONE',
        value: '1',
        'data-testid': 'testid-1',
      },
      {
        id: 'TWO',
        value: '2',
        'data-testid': 'testid-2',
      },
    ];

    const onChange = jest.fn((event) => {
      expect(event).toBeDefined();
      expect(event).toHaveProperty(['target', 'value']);

      const { target } = event;
      const option = radioGroupOptions.find(
        (optn) => target.value === optn.value,
      );

      expect(option).not.toBeNull();
      expect(target.value).toEqual(option.value);
    });

    const { getByTestId } = render(
      <Grommet>
        <RadioButtonGroup
          name="test"
          options={radioGroupOptions}
          onChange={onChange}
        />
      </Grommet>,
    );

    // Select first radio button
    fireEvent.click(getByTestId('testid-1'));
    expect(onChange).toBeCalledTimes(1);

    // Select first radio button again - should not trigger onChange
    fireEvent.click(getByTestId('testid-1'));
    expect(onChange).toBeCalledTimes(1);

    // Select second radio button
    fireEvent.click(getByTestId('testid-2'));
    expect(onChange).toBeCalledTimes(2);
  });

  test('Works with keyboard', async () => {
    const onChange = jest.fn();

    const { getByTestId } = render(
      <Grommet>
        <RadioButtonGroup
          name="test"
          value="2"
          options={[
            {
              id: 'ONE',
              value: '1',
              'data-testid': 'testid-1',
            },
            {
              id: 'TWO',
              value: '2',
              'data-testid': 'testid-2',
            },
            {
              id: 'THREE',
              value: '3',
              'data-testid': 'testid-3',
            },
          ]}
          onChange={onChange}
        />
      </Grommet>,
    );

    // Focus radio '2' button and simulate ArrowDown key
    // should result in selecting radio '3'
    const middleRadioBtn = getByTestId('testid-2');
    middleRadioBtn.focus();

    // focusing the radio button results in internal state update
    // so we wait (`act`) after focusing

    await waitFor(() => getByTestId('testid-2'));
    setTimeout(() => {
      fireEvent.keyDown(middleRadioBtn, {
        key: 'ArrowDown',
        keyCode: 40,
        which: 40,
        bubbles: true,
        cancelable: true,
      });
      expect(onChange).toBeCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ target: { value: '3' } }),
      );
    }, 50);

    // Focus radio '2' button and simulate ArrowUp key
    // should result in selecting radio '1'
    middleRadioBtn.focus();
    await waitFor(() => getByTestId('testid-2'));
    setTimeout(() => {
      fireEvent.keyDown(middleRadioBtn, {
        key: 'ArrowUp',
        keyCode: 38,
        which: 38,
        bubbles: true,
        cancelable: true,
      });
      expect(onChange).toBeCalledTimes(2);
      expect(onChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ target: { value: '1' } }),
      );
    }, 50);
  });
});
