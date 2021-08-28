import { HttpStatusProps } from './shared';

export interface AuthProps extends HttpStatusProps {
  authenticated?: boolean;
}
