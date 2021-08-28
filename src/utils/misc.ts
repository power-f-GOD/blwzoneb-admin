/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const inputProps = {
  onKeyPress: (e: any) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.target.blur();
    }
  }
};
