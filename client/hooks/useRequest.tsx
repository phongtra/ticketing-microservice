import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';

type Request = {
  url: string;
  method: string;
  body: { [key: string]: any };
  onSuccess?: (data: AxiosResponse) => void;
};

export default ({ url, method, body, onSuccess }: Request) => {
  const [errors, setErrors] = useState<JSX.Element | null>(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const res: AxiosResponse = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(res.data);
      }
    } catch (e) {
      return setErrors(
        <div className='alert alert-danger'>
          <h4>Ooopss...</h4>
          <ul className='my-0'>
            {e.response.data.errors.map((err) => {
              return <li key={err.message}>{err.message}</li>;
            })}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
