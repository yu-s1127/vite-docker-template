import axios from 'axios';
import { SyntheticEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [redirect, setRedirect] = useState<boolean>(false);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await axios
      .post('login', {
        email: email,
        password: password,
      })
      .then(() => {
        setRedirect(true);
      })
      .catch(() => {
        alert('failed to login');
        setRedirect(false);
      });
  };

  if (redirect) {
    return <Navigate to='/' />;
  }

  return (
    <main className='form-container'>
      <div className='form-signin'>
        <form onSubmit={submit}>
          <h1 className='h3 mb-3 fw-normal'>Please sign in</h1>

          <div className='form-floating'>
            <input
              type='email'
              className='form-control'
              id='floatingInput'
              placeholder='name@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor='floatingInput'>Email address</label>
          </div>
          <div className='form-floating'>
            <input
              type='password'
              className='form-control'
              id='floatingPassword'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor='floatingPassword'>Password</label>
          </div>
          <button className='w-100 btn btn-lg btn-primary' type='submit'>
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
