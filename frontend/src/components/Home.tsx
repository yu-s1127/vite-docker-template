import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/authSlice';
import { RootState } from '../redux/store';

const Home = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('user');

        dispatch(setUser(data));
      } catch (e) {
        dispatch(setUser(undefined));
      }
    })();
  }, []);

  return (
    <div className='container mt-5 text-center'>
      <h3>
        {user !== undefined
          ? `Hi ${user?.first_name} ${user?.last_name}`
          : 'You are not authenticated'}
      </h3>
    </div>
  );
};

export default Home;
