import { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import { AxiosResponse } from 'axios';
import { CurrentUser } from '../types';
import { AppContextType } from 'next/dist/next-server/lib/utils';
import Header from '../components/Header';

const AppComponent = ({
  Component,
  pageProps,
  currentUser
}: AppProps & CurrentUser) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />;
    </div>
  );
};

AppComponent.getInitialProps = async ({ ctx, Component }: AppContextType) => {
  const client = buildClient(ctx);
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  const { data }: AxiosResponse<CurrentUser> = await client.get(
    '/api/users/currentuser'
  );
  console.log(data);
  return { pageProps, ...data };
};

export default AppComponent;
