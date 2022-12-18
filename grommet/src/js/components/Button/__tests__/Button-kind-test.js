import React from 'react';

import 'jest-styled-components';
import 'jest-axe/extend-expect';
import 'regenerator-runtime/runtime';

import { axe } from 'jest-axe';
import { fireEvent, render } from '@testing-library/react';
import { Add } from 'grommet-icons';

import { Grommet, Button } from '../..';
import { buttonKindTheme } from './theme/buttonKindTheme';

describe('Button kind', () => {
  test('should have no accessibility violations', async () => {
    const { container, getByText } = render(
      <Grommet
        theme={{
          button: { default: {} },
        }}
      >
        <Button a11yTitle="Test button" label="Test" onClick={() => {}} />
      </Grommet>,
    );

    fireEvent.click(getByText('Test'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('default button', () => {
    const { container } = render(
      <Grommet theme={buttonKindTheme}>
        <Button />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('button with icon and align', () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            default: {
              color: undefined, // needed use case for the test coverage
            },
          },
        }}
      >
        <Button icon={<Add />} align="start" />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('button icon colors', () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            default: {
              background: {
                color: '#666666',
              },
              border: {
                color: '#666666',
              },
              color: undefined, // needed use case for the test coverage
            },
          },
        }}
      >
        <Button icon={<Add />} color="#000" />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`mouseOver and mouseOut events`, async () => {
    const { container, getByText } = render(
      <Grommet
        theme={{
          button: {
            default: {
              background: '#000',
            },
          },
        }}
      >
        <Button label="label" icon={<Add />} />
      </Grommet>,
    );
    fireEvent.mouseOver(getByText('label'));
    expect(container.firstChild).toMatchSnapshot();

    fireEvent.mouseOut(getByText('label'));
    expect(container.firstChild).toMatchSnapshot();
  });

  test('primary button', () => {
    const { container } = render(
      <Grommet theme={buttonKindTheme}>
        <Button primary />
        <Button primary disabled />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('secondary button', () => {
    const { container } = render(
      <Grommet theme={buttonKindTheme}>
        <Button secondary />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('border on default button', () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            default: {
              border: {
                color: 'green',
                width: '2px',
              },
            },
          },
        }}
      >
        <Button label="Test" />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('no border on default button', () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            default: {
              border: false,
            },
          },
        }}
      >
        <Button label="Test" />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('extend on default button', () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            default: {
              extend: {
                color: 'green',
              },
            },
          },
        }}
      >
        <Button label="Test" />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('fill', () => {
    const { container } = render(
      <Grommet
        theme={{
          button: { default: {} },
        }}
      >
        <Button label="Test" fill />
        <Button label="Test" fill="vertical" />
        <Button label="Test" fill="horizontal" />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('font on button default', () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            default: {
              font: {
                weight: 700,
                height: '20px',
              },
            },
          },
        }}
      >
        <Button label="Test" />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('font undefined', () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            default: {
              font: {
                weight: undefined,
                height: undefined,
              },
            },
          },
        }}
      >
        <Button label="Test" />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('hover on default button', () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            default: {
              hover: {
                color: 'white',
                background: 'green',
              },
            },
          },
        }}
      >
        <Button label="Test" plain hoverIndicator onClick={() => {}} />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('opacity on default button', () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            default: {
              opacity: true,
            },
          },
        }}
      >
        <Button label="Test" />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('padding on default button', () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            default: {
              padding: {
                horizontal: '12px',
                vertical: '6px',
              },
              background: {
                color: 'green',
              },
              color: 'text',
            },
          },
        }}
      >
        <Button label="Test" />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('render of children', () => {
    const { container } = render(
      <Grommet theme={buttonKindTheme}>
        <Button>Test</Button>
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('no padding on default button', () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            default: {
              padding: '0px',
              color: 'text',
              border: {
                color: false,
              },
            },
          },
        }}
      >
        <Button label="Test" />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('size of default button', () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            size: {
              small: {
                border: {
                  radius: '4px',
                },
                pad: {
                  vertical: '4px',
                  horizontal: '8px',
                },
              },
            },
            default: {},
          },
        }}
      >
        <Button label="Test" size="small" />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`disabled state cursor should indicate the button cannot be 
  clicked`, () => {
    const { getByText } = render(
      <Grommet
        theme={{
          button: { default: {} },
        }}
      >
        <Button disabled label="Button" />
      </Grommet>,
    );

    const button = getByText('Button');
    // eslint-disable-next-line no-underscore-dangle
    const cursorStyle = window.getComputedStyle(button)._values.cursor;
    expect(cursorStyle).not.toBe('pointer');
    expect(cursorStyle).toBe('default');
  });

  test(`disabled with hoverIndicator should not hover`, () => {
    const { container, getByText } = render(
      <Grommet
        theme={{
          button: { default: {} },
        }}
      >
        <Button disabled hoverIndicator label="Button" />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    fireEvent.mouseOver(getByText('Button'));
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`should apply styling according to theme size definitions`, () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            default: {},
            size: {
              small: {
                border: {
                  radius: '4px',
                },
                pad: {
                  vertical: '4px',
                  horizontal: '8px',
                },
              },
              medium: {
                border: {
                  radius: '4px',
                },
                pad: {
                  vertical: '6px',
                  horizontal: '12px',
                },
              },
              large: {
                border: {
                  radius: '6px',
                },
                pad: {
                  vertical: '6px',
                  horizontal: '16px',
                },
              },
            },
          },
        }}
      >
        <Button label="Button" size="small" />
        {/* button with no size specified should have medium styling applied 
        by default */}
        <Button label="Button" />
        <Button label="Button" size="medium" />
        <Button label="Button" size="large" />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`badge should be offset from top-right corner`, () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            default: {
              border: {
                color: 'border',
                width: '2px',
              },
            },
          },
        }}
      >
        <Button a11yTitle="Button, alert" label="Button" badge />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`badge should display number content`, () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            default: {
              border: {
                color: 'border',
                width: '2px',
              },
            },
          },
        }}
      >
        <Button a11yTitle="Button, 2 unread alerts" label="Button" badge={2} />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`badge should display "+" when number is greater than max`, () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            default: {
              border: {
                color: 'border',
                width: '2px',
              },
            },
          },
        }}
      >
        <Button
          a11yTitle="Button, 100 unread alerts"
          label="Button"
          badge={{ value: 100, max: 9 }}
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`badge should apply background`, () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            default: {
              border: {
                color: 'border',
                width: '2px',
              },
            },
          },
        }}
      >
        <Button
          a11yTitle="Button, 100 unread alerts"
          label="Button"
          badge={{
            background: 'status-ok',
            value: 100,
          }}
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`badge should render custom element`, () => {
    const { container } = render(
      <Grommet
        theme={{
          button: {
            default: {
              border: {
                color: 'border',
                width: '2px',
              },
            },
          },
        }}
      >
        <Button
          a11yTitle="Button, Add user alert"
          label="Button"
          badge={<Add />}
        />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`badge should render relative to contents when button has no 
  border or background`, () => {
    const { container } = render(
      <Grommet
        theme={{
          button: { default: {} },
        }}
      >
        <Button a11yTitle="Button, Add user alert" icon={<Add />} badge />
      </Grommet>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test(`hoverIndicator with color and background`, () => {
    const { container, getByText } = render(
      <Grommet
        theme={{
          button: { default: {} },
        }}
      >
        <Button
          hoverIndicator={{
            background: {
              color: 'pink',
            },
            color: 'white',
          }}
          label="Button"
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    fireEvent.mouseOver(getByText('Button'));
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`hover secondary with color and background`, () => {
    const { container, getByText } = render(
      <Grommet
        theme={{
          button: {
            default: {},
            secondary: {
              color: 'white',
              background: {
                color: 'skyblue',
              },
            },
            hover: {
              secondary: {
                color: 'green',
                background: {
                  color: 'orange',
                },
              },
            },
          },
        }}
      >
        <Button secondary label="Button" />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    fireEvent.mouseOver(getByText('Button'));
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`plain with icon`, () => {
    const { asFragment } = render(
      <Grommet
        theme={{
          button: { default: {} },
        }}
      >
        <Button plain icon={<Add />} />
      </Grommet>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
