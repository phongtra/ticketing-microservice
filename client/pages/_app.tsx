import { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import { AxiosResponse } from 'axios';
import { CurrentUser } from '../types';
import { AppContextType } from 'next/dist/next-server/lib/utils';

const AppComponent = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

AppComponent.getInitialProps = async ({ ctx }: AppContextType) => {
  const client = buildClient(ctx);
  const { data }: AxiosResponse<CurrentUser> = await client.get(
    '/api/users/currentuser'
  );
  return data;
};
