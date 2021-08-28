/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { memo, useMemo } from 'react';

const _FAIcon = (props: {
  name: string;
  className?: string;
  color?: string;
  fontSize?: string;
  variant?: 'solid' | 'outlined';
}) => {
  const { className, color, fontSize, variant, name } = props;

  return (
    <i
      className={`${variant === 'outlined' ? 'far' : 'fas'} fa-${name} ${className} icon`}
      style={useMemo(() => ({ color, fontSize }), [color, fontSize])}></i>
  );
};

export const FAIcon = memo(_FAIcon);
