import { HttpStatusProps } from './shared';

export interface APIRegistrantsResponseModel {
  chapter: string;
  date: number | string;
  designation: string;
  email: string;
  full_name: string;
  phone: string;
  title: string;
  zone: string;
  __v: 0;
  _id: string;
}

export interface SearchProps extends HttpStatusProps {
  data?: APIRegistrantsResponseModel[];
  query?: string;
}
