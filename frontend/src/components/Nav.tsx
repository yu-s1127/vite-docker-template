import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { setUser } from '../redux/authSlice';
import { RootState } from '../redux/store';

const Nav = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const logout = async () => {
    await axios.post('logout');

    dispatch(setUser(undefined));
  };

  return (
    <header className='p-3 bg-dark text-white'>
      <div className='container'>
        <div className='d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start'>
          <ul className='nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0'>
            <li>
              <Link to='/' className='nav-link px-2 text-white'>
                Home
              </Link>
            </li>
          </ul>
          {user === undefined && (
            <div className='text-end'>
              <Link to='/login' className='btn btn-outline-light me-2'>
                Login
              </Link>
              <Link to='/register' className='btn btn-outline-light me-2'>
                Register
              </Link>
            </div>
          )}
          {user !== undefined && (
            <div className='text-end'>
              <Link
                to='/'
                onClick={logout}
                className='btn btn-outline-light me-2'
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Nav;
