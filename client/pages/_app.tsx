import { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.css';

export default ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};
