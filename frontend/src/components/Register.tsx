import axios from 'axios';
import { SyntheticEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';

const Register = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [redirect, setRedirect] = useState<boolean>(false);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      alert('password is incorrect');
      setRedirect(false);
    }

    await axios
      .post('register', {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      })
      .then(() => {
        alert('failed to register');
        setRedirect(true);
      })
      .catch(() => {
        setRedirect(false);
      });
  };

  if (redirect) {
    return <Navigate to='/login' />;
  }

  return (
    <main className='form-container'>
      <div className='form-signin'>
        <form onSubmit={submit}>
          <h1 className='h3 mb-3 fw-normal'>Please Register</h1>

          <div className='form-floating'>
            <input
              className='form-control'
              id='floatingInput'
              placeholder='First Name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label htmlFor='floatingInput'>First Name</label>
          </div>

          <div className='form-floating'>
            <input
              className='form-control'
              id='floatingInput'
              placeholder='Last Name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <label htmlFor='floatingInput'>Last Name</label>
          </div>

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

          <div className='form-floating'>
            <input
              type='password'
              className='form-control'
              id='floatingPassword'
              placeholder='Password Confirm'
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <label htmlFor='floatingPassword'>Password Confirm</label>
          </div>

          <button className='w-100 btn btn-lg btn-primary' type='submit'>
            Submit
          </button>
        </form>
      </div>
    </main>
  );
};

export default Register;
