import PropTypes from 'prop-types';
import {
  backgroundDoc,
  elevationPropType,
  genericProps,
  heightPropType,
  hoverIndicatorPropType,
  padPropType,
  roundPropType,
  widthPropType,
} from '../../utils/general-prop-types';

const OVERFLOW_VALUES = ['auto', 'hidden', 'scroll', 'visible'];

const ANIMATION_TYPE = PropTypes.oneOf([
  'fadeIn',
  'fadeOut',
  'jiggle',
  'pulse',
  'rotateLeft',
  'rotateRight',
  'slideUp',
  'slideDown',
  'slideLeft',
  'slideRight',
  'zoomIn',
  'zoomOut',
]);
const ANIMATION_SHAPE = PropTypes.shape({
  type: ANIMATION_TYPE,
  delay: PropTypes.number,
  duration: PropTypes.number,
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge']),
});

const BORDER_SHAPE = PropTypes.shape({
  color: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      dark: PropTypes.string,
      light: PropTypes.string,
    }),
  ]),
  side: PropTypes.oneOf([
    'top',
    'left',
    'bottom',
    'right',
    'start',
    'end',
    'horizontal',
    'vertical',
    'all',
    'between',
  ]),
  size: PropTypes.oneOfType([
    PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge']),
    PropTypes.string,
  ]),
  style: PropTypes.oneOf([
    'solid',
    'dashed',
    'dotted',
    'double',
    'groove',
    'ridge',
    'inset',
    'outset',
    'hidden',
  ]),
});

// if you update values here, make sure to update in Drop/doc too.
const overflowPropType = PropTypes.oneOfType([
  PropTypes.oneOf(OVERFLOW_VALUES),
  PropTypes.shape({
    horizontal: PropTypes.oneOf(OVERFLOW_VALUES),
    vertical: PropTypes.oneOf(OVERFLOW_VALUES),
  }),
  PropTypes.string,
]);

let PropType = {};
if (process.env.NODE_ENV !== 'production') {
  PropType = {
    ...genericProps,
    align: PropTypes.oneOfType([
      PropTypes.oneOf(['baseline', 'center', 'end', 'start', 'stretch']),
      PropTypes.string,
    ]),
    alignContent: PropTypes.oneOfType([
      PropTypes.oneOf([
        'around',
        'baseline',
        'between',
        'center',
        'evenly',
        'end',
        'start',
        'stretch',
      ]),
      PropTypes.string,
    ]),
    animation: PropTypes.oneOfType([
      ANIMATION_TYPE,
      ANIMATION_SHAPE,
      PropTypes.arrayOf(PropTypes.oneOfType([ANIMATION_TYPE, ANIMATION_SHAPE])),
    ]),
    background: backgroundDoc,
    basis: PropTypes.oneOfType([
      PropTypes.oneOf([
        'xxsmall',
        'xsmall',
        'small',
        'medium',
        'large',
        'xlarge',
        'xxlarge',
        'full',
        '1/2',
        '1/3',
        '2/3',
        '1/4',
        '2/4',
        '3/4',
        'auto',
      ]),
      PropTypes.string,
    ]),
    border: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.oneOf([
        'top',
        'left',
        'bottom',
        'right',
        'start',
        'end',
        'horizontal',
        'vertical',
        'all',
        'between',
      ]),
      BORDER_SHAPE,
      PropTypes.arrayOf(BORDER_SHAPE),
    ]),
    direction: PropTypes.oneOf([
      'row',
      'column',
      'row-responsive',
      'row-reverse',
      'column-reverse',
    ]),
    elevation: elevationPropType,
    flex: PropTypes.oneOfType([
      PropTypes.oneOf(['grow', 'shrink']),
      PropTypes.bool,
      PropTypes.shape({
        grow: PropTypes.number,
        shrink: PropTypes.number,
      }),
    ]),
    fill: PropTypes.oneOfType([
      PropTypes.oneOf(['horizontal', 'vertical']),
      PropTypes.bool,
    ]),
    focusIndicator: PropTypes.bool,
    gap: PropTypes.oneOfType([
      PropTypes.oneOf([
        'none',
        'xxsmall',
        'xsmall',
        'small',
        'medium',
        'large',
        'xlarge',
      ]),
      PropTypes.string,
    ]),
    height: heightPropType,
    hoverIndicator: hoverIndicatorPropType,
    justify: PropTypes.oneOf([
      'around',
      'between',
      'center',
      'end',
      'evenly',
      'start',
      'stretch',
    ]),
    onClick: PropTypes.func,
    overflow: overflowPropType,
    pad: padPropType,
    responsive: PropTypes.bool,
    round: roundPropType,
    tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    as: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
      PropTypes.elementType,
    ]),
    width: widthPropType,
    wrap: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['reverse'])]),
  };
}
export const BoxPropTypes = PropType;
