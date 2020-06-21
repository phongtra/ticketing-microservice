import axios from 'axios';
import { useState } from 'react';

type Request = {
  url: string;
  method: string;
  body: { [key: string]: any };
};

export default ({ url, method, body }: Request) => {
  const [errors, setErrors] = useState<JSX.Element | null>(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const res = await axios[method](url, body);
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
