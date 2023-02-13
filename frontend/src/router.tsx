import { Route, Routes } from 'react-router-dom';
import NotFound from './components/ErrorPages/NotFound';
import Home from './components/Home';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
};
export default Router;
