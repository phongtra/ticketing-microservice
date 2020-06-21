import { NextPage } from 'next';

const LandingPage: NextPage<{ color: string }> = ({ color }) => {
  console.log('I am in the browser', color);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = () => {
  console.log('I am on the server');
  return { color: 'red' };
};

export default LandingPage;
