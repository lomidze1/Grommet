import React, {
  Children,
  forwardRef,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ThemeContext } from 'styled-components';
import { defaultProps } from '../../default-props';
import { backgroundIsDark } from '../../utils';
import { Keyboard } from '../Keyboard';

import { StyledBox, StyledBoxGap } from './StyledBox';
import { BoxPropTypes } from './propTypes';

const Box = forwardRef(
  (
    {
      a11yTitle,
      background,
      border,
      children,
      direction = 'column',
      elevation, // munged to avoid styled-components putting it in the DOM
      fill, // munged to avoid styled-components putting it in the DOM
      gap,
      kind, // munged to avoid styled-components putting it in the DOM
      onBlur,
      onClick,
      onFocus,
      overflow, // munged to avoid styled-components putting it in the DOM
      responsive = true,
      tag,
      as,
      wrap, // munged to avoid styled-components putting it in the DOM,
      width, // munged to avoid styled-components putting it in the DOM
      height, // munged to avoid styled-components putting it in the DOM
      tabIndex,
      ...rest
    },
    ref,
  ) => {
    const theme = useContext(ThemeContext) || defaultProps.theme;

    const focusable = useMemo(
      () => onClick && !(tabIndex < 0),
      [onClick, tabIndex],
    );

    const [focus, setFocus] = useState();

    const clickProps = useMemo(() => {
      if (focusable) {
        return {
          onClick,
          onFocus: (event) => {
            setFocus(true);
            if (onFocus) onFocus(event);
          },
          onBlur: (event) => {
            setFocus(false);
            if (onBlur) onBlur(event);
          },
        };
      }
      const result = {};
      if (onBlur) result.onBlur = onBlur;
      if (onClick) result.onClick = onClick;
      if (onFocus) result.onFocus = onFocus;
      return result;
    }, [focusable, onClick, onFocus, onBlur]);

    const adjustedTabIndex = useMemo(() => {
      if (tabIndex !== undefined) return tabIndex;
      if (focusable) return 0;
      return undefined;
    }, [focusable, tabIndex]);

    if (
      (border === 'between' || (border && border.side === 'between')) &&
      !gap
    ) {
      console.warn('Box must have a gap to use border between');
    }

    let contents = children;
    if (gap && gap !== 'none') {
      const boxAs = !as && tag ? tag : as;
      contents = [];
      let firstIndex;
      Children.forEach(children, (child, index) => {
        if (child) {
          if (firstIndex === undefined) {
            firstIndex = index;
          } else {
            contents.push(
              <StyledBoxGap
                // eslint-disable-next-line react/no-array-index-key
                key={`gap-${index}`}
                as={boxAs === 'span' ? boxAs : 'div'}
                gap={gap}
                directionProp={direction}
                responsive={responsive}
                border={border}
              />,
            );
          }
        }
        contents.push(child);
      });
    }

    // construct a new theme object in case we have a background that wants
    // to change the background color context
    const nextTheme = useMemo(() => {
      let result;
      if (background || theme.darkChanged) {
        const dark = backgroundIsDark(background, theme);
        const darkChanged = dark !== undefined && dark !== theme.dark;
        if (darkChanged || theme.darkChanged) {
          result = { ...theme };
          result.dark = dark === undefined ? theme.dark : dark;
          result.background = background;
        } else if (background) {
          // This allows DataTable to intelligently set the background
          // of a pinned header or footer.
          result = { ...theme };
          result.background = background;
        }
      }
      return result || theme;
    }, [background, theme]);

    let content = (
      <StyledBox
        as={!as && tag ? tag : as}
        aria-label={a11yTitle}
        background={background}
        border={border}
        ref={ref}
        directionProp={direction}
        elevationProp={elevation}
        fillProp={fill}
        focus={focus}
        kindProp={kind}
        overflowProp={overflow}
        wrapProp={wrap}
        widthProp={width}
        heightProp={height}
        responsive={responsive}
        tabIndex={adjustedTabIndex}
        {...clickProps}
        {...rest}
      >
        <ThemeContext.Provider value={nextTheme}>
          {contents}
        </ThemeContext.Provider>
      </StyledBox>
    );

    if (onClick) {
      content = <Keyboard onEnter={onClick}>{content}</Keyboard>;
    }

    return content;
  },
);

Box.displayName = 'Box';
Box.propTypes = BoxPropTypes;
export { Box };
