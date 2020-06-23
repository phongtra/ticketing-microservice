import { useEffect } from 'react';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

export default () => {
  const { doRequest, errors } = useRequest({
    url: '/api/users/signout',
    method: 'get',
    onSuccess: () => Router.push('/')
  });
  useEffect(() => {
    doRequest();
  }, [doRequest]);
  return <div>Signing you out</div>;
};
