import * as React from 'react';
import {
  A11yTitleType,
  AlignSelfType,
  GridAreaType,
  MarginType,
  BackgroundType,
  PadType,
  BorderType,
} from '../../utils';
import { PaginationType } from '../Pagination';

type Sections<TBody, THeader = TBody, TFooter = TBody, TPinned = TBody> = {
  header?: THeader;
  body?: TBody;
  footer?: TFooter;
  pinned?: TPinned;
};

export type ColumnSizeType =
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | '1/2'
  | '1/4'
  | '2/4'
  | '3/4'
  | '1/3'
  | '2/3';

export type MouseClick<TRowType> = React.MouseEvent<HTMLTableRowElement> & {
  datum: TRowType;
  index: number;
};

export type KeyPress<TRowType> = React.KeyboardEvent & { datum: TRowType };

type VerticalAlignType = 'middle' | 'top' | 'bottom';

export interface ColumnConfig<TRowType> {
  align?: 'center' | 'start' | 'end';
  aggregate?: 'avg' | 'max' | 'min' | 'sum';
  footer?: React.ReactNode | { aggregate?: boolean };
  header?: string | React.ReactNode | { aggregate?: boolean };
  pin?: boolean;
  plain?: boolean;
  primary?: boolean;
  property: string;
  render?: (datum: TRowType) => React.ReactNode;
  search?: boolean;
  show?: number | { page?: number };
  sortable?: boolean;
  size?: ColumnSizeType | string;
  units?: string;
  verticalAlign?: VerticalAlignType;
}

export interface DataTableProps<TRowType = any> {
  a11yTitle?: A11yTitleType;

  // Appearance
  alignSelf?: AlignSelfType;
  background?:
    | BackgroundType
    | Sections<BackgroundType | string[], BackgroundType, BackgroundType>;
  border?: BorderType | Sections<BorderType>;
  columns?: ColumnConfig<TRowType>[];
  fill?: boolean | 'vertical' | 'horizontal';
  gridArea?: GridAreaType;
  margin?: MarginType;
  pad?: PadType | Sections<PadType>;
  paginate?: boolean | PaginationType;
  pin?: boolean | 'header' | 'footer';
  placeholder?: string | React.ReactNode;
  resizeable?: boolean;
  replace?: boolean;
  rowProps?: {
    [primaryValue: string]: {
      background?: BackgroundType;
      border?: BorderType;
      pad?: PadType;
    };
  };
  rowDetails?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | string;

  // Data
  data?: TRowType[];
  disabled?: (string | number)[];
  groupBy?:
    | string
    | {
        property?: string;
        expand?: Array<string>;
        expandable?: Array<string>;
        select?: { [key: string]: 'all' | 'some' | 'none' };
        onExpand?: (expandedKeys: string[]) => void;
        onSelect?: (select: (string | number)[], datum: TRowType) => void;
      };
  primaryKey?: string | boolean;
  select?: (string | number)[];
  sort?: { property: string; direction: 'asc' | 'desc'; external?: boolean };
  sortable?: boolean;
  step?: number;

  // Events
  onClickRow?:
    | 'select'
    | ((event: MouseClick<TRowType> | KeyPress<TRowType>) => void);
  onMore?: () => void;
  onSearch?: (search: string) => void;
  onSelect?: (select: (string | number)[], datum: TRowType) => void;
  onSort?: (sort: { property: string; direction: 'asc' | 'desc' }) => void;
  onUpdate?: (datatableState: {
    sort?: { property: string; direction: 'asc' | 'desc' };
    expanded?: Array<string>;
    show: number;
    count: number;
  }) => void;
  verticalAlign?:
    | VerticalAlignType
    | {
        header?: VerticalAlignType;
        body?: VerticalAlignType;
        footer?: VerticalAlignType;
      };
}

export interface DataTableExtendedProps<TRowType = any>
  extends DataTableProps<TRowType>,
    Omit<
      JSX.IntrinsicElements['table'],
      'onSelect' | 'placeholder' | 'border'
    > {}

declare class DataTable<TRowType = any> extends React.Component<
  DataTableExtendedProps<TRowType>
> {}

export { DataTable };
