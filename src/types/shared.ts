/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HttpStatusProps {
  status?: 'settled' | 'pending' | 'fulfilled';
  err?: boolean;
  statusText?: string;
}

export interface FetchState<T, T2 = any> extends HttpStatusProps {
  data?: T;
  extra?: T2;
}

export interface APIBaseResponse<T> {
  message?: string;
  data?: T;
}

import { DetailedHTMLProps, HTMLAttributes, RefObject, BlockquoteHTMLAttributes } from 'react';

export interface BoxProps
  extends Partial<
    DetailedHTMLProps<
      HTMLAttributes<HTMLElement> & BlockquoteHTMLAttributes<HTMLElement>,
      HTMLElement & HTMLParagraphElement & HTMLOListElement & HTMLUListElement & HTMLLIElement
    >
  > {
  as?: BoxAs;
  _ref?: RefObject<
    HTMLElement & HTMLParagraphElement & HTMLOListElement & HTMLUListElement & HTMLLIElement
  >;
}

export interface AppSnackbarProps {
  open?: boolean;
  message?: string;
  severity?: 'error' | 'info' | 'success' | 'warning';
  duration?: number;
  label?: string;
}

export type BoxAs =
  | 'address'
  | 'nav'
  | 'header'
  | 'main'
  | 'aside'
  | 'footer'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'div'
  | 'span'
  | 'p'
  | 'ul'
  | 'ol'
  | 'li'
  | 'section'
  | 'i'
  | 'small'
  | 'blockquote';
