import React, {
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { ThemeContext } from 'styled-components';
import { ContainerTargetContext } from '../../contexts/ContainerTargetContext';
import { FocusedContainer } from '../FocusedContainer';
import {
  backgroundIsDark,
  findScrollParents,
  parseMetricToNum,
  PortalContext,
} from '../../utils';
import { defaultProps } from '../../default-props';
import { Box } from '../Box';
import { Keyboard } from '../Keyboard';

import { StyledDrop } from './StyledDrop';

// using react synthetic event to be able to stop propagation that
// would otherwise close the layer on ESC.
const preventLayerClose = (event) => {
  const key = event.keyCode ? event.keyCode : event.which;

  if (key === 27) {
    event.stopPropagation();
  }
};

const defaultAlign = { top: 'top', left: 'left' };
const defaultPortalContext = [];

const DropContainer = forwardRef(
  (
    {
      a11yTitle,
      'aria-label': ariaLabel,
      align = defaultAlign,
      background,
      onAlign,
      children,
      dropTarget,
      elevation,
      onClickOutside,
      onEsc,
      onKeyDown,
      overflow = 'auto',
      plain,
      responsive,
      restrictFocus,
      stretch = 'width',
      trapFocus,
      ...rest
    },
    ref,
  ) => {
    const containerTarget = useContext(ContainerTargetContext);
    const theme = useContext(ThemeContext) || defaultProps.theme;
    const portalContext = useContext(PortalContext) || defaultPortalContext;
    const portalId = useMemo(() => portalContext.length, [portalContext]);
    const nextPortalContext = useMemo(
      () => [...portalContext, portalId],
      [portalContext, portalId],
    );
    const dropRef = useRef();
    useEffect(() => {
      const notifyAlign = () => {
        const styleCurrent = (ref || dropRef).current.style;
        const alignControl = styleCurrent.top !== '' ? 'top' : 'bottom';

        onAlign(alignControl);
      };

      // We try to preserve the maxHeight as changing it causes any scroll
      // position to be lost. We set the maxHeight on mount and if the window
      // is resized.
      const place = (preserveHeight) => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const target = dropTarget;
        const container = (ref || dropRef).current;
        if (container && target) {
          // clear prior styling
          container.style.left = '';
          container.style.top = '';
          container.style.bottom = '';
          container.style.width = '';
          if (!preserveHeight) {
            container.style.maxHeight = '';
          }
          // get bounds
          const targetRect = target.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          // determine width
          let width;
          if (stretch) {
            width = Math.min(
              stretch === 'align'
                ? Math.min(targetRect.width, containerRect.width)
                : Math.max(targetRect.width, containerRect.width),
              windowWidth,
            );
          } else {
            width = Math.min(containerRect.width, windowWidth);
          }
          // set left position
          let left;
          if (align.left) {
            if (align.left === 'left') {
              ({ left } = targetRect);
            } else if (align.left === 'right') {
              left = targetRect.left + targetRect.width;
            }
          } else if (align.right) {
            if (align.right === 'left') {
              left = targetRect.left - width;
            } else if (align.right === 'right') {
              left = targetRect.left + targetRect.width - width;
            }
          } else {
            left = targetRect.left + targetRect.width / 2 - width / 2;
          }
          if (left + width > windowWidth) {
            left -= left + width - windowWidth;
          } else if (left < 0) {
            left = 0;
          }
          // set top or bottom position
          let top;
          let bottom;
          let maxHeight = containerRect.height;
          if (align.top) {
            if (align.top === 'top') {
              ({ top } = targetRect);
            } else {
              top = targetRect.bottom;
            }

            // Calculate visible area underneath the control w.r.t window height
            const percentVisibleAreaBelow =
              100 - (targetRect.bottom / windowHeight) * 100;

            // Check whether it is within 20% from bottom of the window or
            // visible area to flip the control
            // DropContainer doesn't fit well within visible area when
            // percentVisibleAreaBelow value<=20%
            // There is enough space from DropContainer to bottom of the window
            // when percentVisibleAreaBelow>20%.

            if (windowHeight === top || percentVisibleAreaBelow <= 20) {
              // We need more room than we have.
              // We put it below, but there's more room above, put it above
              top = '';
              if (align.top === 'bottom') {
                bottom = targetRect.top;
              } else {
                ({ bottom } = targetRect);
              }
              maxHeight = bottom;
              container.style.maxHeight = `${maxHeight}px`;
            } else if (top > 0) {
              maxHeight = windowHeight - top;
              container.style.maxHeight = `${maxHeight}px`;
            } else {
              maxHeight = windowHeight - top;
            }
          } else if (align.bottom) {
            if (align.bottom === 'bottom') {
              ({ bottom } = targetRect);
            } else {
              bottom = targetRect.top;
            }
            maxHeight = bottom;
            container.style.maxHeight = `${maxHeight}px`;
          } else {
            // center
            top =
              targetRect.top + targetRect.height / 2 - containerRect.height / 2;
            maxHeight = windowHeight - top;
          }
          // if we can't fit it all, or we're rather close,
          // see if there's more room the other direction
          if (
            responsive &&
            (containerRect.height > maxHeight || maxHeight < windowHeight / 10)
          ) {
            // We need more room than we have.
            if (align.top && top > windowHeight / 2) {
              // We put it below, but there's more room above, put it above
              top = '';
              if (align.top === 'bottom') {
                // top = Math.max(targetRect.top - containerRect.height, 0);
                // maxHeight = targetRect.top - top;
                bottom = targetRect.top;
              } else {
                // top = Math.max(targetRect.bottom - containerRect.height, 0);
                // maxHeight = targetRect.bottom - top;
                ({ bottom } = targetRect);
              }
              maxHeight = bottom;
            } else if (align.bottom && maxHeight < windowHeight / 2) {
              // We put it above but there's more room below, put it below
              bottom = '';
              if (align.bottom === 'bottom') {
                ({ top } = targetRect);
              } else {
                top = targetRect.bottom;
              }
              maxHeight = windowHeight - top;
            }
          }
          container.style.left = `${left}px`;
          if (stretch) {
            // offset width by 0.1 to avoid a bug in ie11 that
            // unnecessarily wraps the text if width is the same
            // NOTE: turned off for now
            container.style.width = `${width + 0.1}px`;
          }
          // the (position:absolute + scrollTop)
          // is presenting issues with desktop scroll flickering
          if (top !== '') {
            container.style.top = `${top}px`;
          }
          if (bottom !== '') {
            container.style.bottom = `${windowHeight - bottom}px`;
          }
          if (!preserveHeight) {
            if (theme.drop && theme.drop.maxHeight) {
              maxHeight = Math.min(
                maxHeight,
                parseMetricToNum(theme.drop.maxHeight),
              );
            }
            container.style.maxHeight = `${maxHeight}px`;
          }
        }
        if (onAlign) notifyAlign();
      };

      let scrollParents;

      const addScrollListeners = () => {
        scrollParents = findScrollParents(dropTarget);
        scrollParents.forEach((scrollParent) =>
          scrollParent.addEventListener('scroll', place),
        );
      };

      const removeScrollListeners = () => {
        scrollParents.forEach((scrollParent) =>
          scrollParent.removeEventListener('scroll', place),
        );
        scrollParents = [];
      };

      const onClickDocument = (event) => {
        // determine which portal id the target is in, if any
        let clickedPortalId = null;
        let node =
          containerTarget === document.body
            ? event.target
            : event?.composedPath()[0];
          
        while (clickedPortalId === null && node !== document) {
          const attr = node.getAttribute('data-g-portal-id');
          if (attr !== null) clickedPortalId = parseInt(attr, 10);
          node = node.parentNode;
        }
        if (
          clickedPortalId === null ||
          portalContext.indexOf(clickedPortalId) !== -1
        ) {
          onClickOutside(event);
        }
      };

      const onResize = () => {
        removeScrollListeners();
        addScrollListeners();
        place(false);
      };

      addScrollListeners();
      window.addEventListener('resize', onResize);
      if (onClickOutside) {
        document.addEventListener('mousedown', onClickDocument);
      }

      place(false);

      return () => {
        removeScrollListeners();
        window.removeEventListener('resize', onResize);
        if (onClickOutside) {
          document.removeEventListener('mousedown', onClickDocument);
        }
      };
    }, [
      align,
      containerTarget,
      onAlign,
      dropTarget,
      onClickOutside,
      portalContext,
      portalId,
      ref,
      responsive,
      restrictFocus,
      stretch,
      theme.drop,
    ]);

    useEffect(() => {
      if (restrictFocus) {
        (ref || dropRef).current.focus();
      }
    }, [ref, restrictFocus]);

    let content = (
      <StyledDrop
        aria-label={a11yTitle || ariaLabel}
        ref={ref || dropRef}
        as={Box}
        background={background}
        plain={plain}
        elevation={
          !plain
            ? elevation ||
              theme.global.drop.elevation ||
              theme.global.drop.shadowSize || // backward compatibility
              'small'
            : undefined
        }
        tabIndex="-1"
        alignProp={align}
        overflow={overflow}
        data-g-portal-id={portalId}
        {...rest}
      >
        {children}
      </StyledDrop>
    );

    const themeContextValue = useMemo(() => {
      let dark;
      if (background || theme.global.drop.background) {
        dark = backgroundIsDark(
          background || theme.global.drop.background,
          theme,
        );
      }
      return { ...theme, dark };
    }, [background, theme]);

    const { dark } = themeContextValue;
    if (dark !== undefined && dark !== theme.dark) {
      content = (
        <ThemeContext.Provider value={themeContextValue}>
          {content}
        </ThemeContext.Provider>
      );
    }

    return (
      <PortalContext.Provider value={nextPortalContext}>
        <FocusedContainer
          onKeyDown={onEsc && preventLayerClose}
          trapFocus={trapFocus}
        >
          <Keyboard
            // should capture keyboard event before other elements,
            // such as Layer
            // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
            capture
            onEsc={
              onEsc
                ? (event) => {
                    event.stopPropagation();
                    onEsc(event);
                  }
                : undefined
            }
            onKeyDown={onKeyDown}
            target="document"
          >
            {content}
          </Keyboard>
        </FocusedContainer>
      </PortalContext.Provider>
    );
  },
);

export { DropContainer };
