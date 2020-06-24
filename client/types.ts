import { AxiosResponse } from 'axios';

export interface CurrentUser {
  currentUser: {
    id: string;
    email: string;
    iat?: number;
  };
}

export interface Request {
  url: string;
  method: string;
  body?: { [key: string]: any };
  onSuccess?: (data: AxiosResponse) => void;
}
