import { NextPage } from 'next';
import { AxiosResponse } from 'axios';
import { CurrentUser } from '../types';
import buildClient from '../api/buildClient';

const LandingPage: NextPage<CurrentUser> = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data }: AxiosResponse<CurrentUser> = await client.get(
    '/api/users/currentuser'
  );
  return data;
};

export default LandingPage;
