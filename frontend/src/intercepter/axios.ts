import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080/api/';
axios.defaults.withCredentials = true;

let refresh = false;

axios.interceptors.response.use(
  (resp) => resp,
  async (err) => {
    if (err.response.status === 401 && !refresh) {
      refresh = true;
      const response = await axios.post('refresh', {});

      if (response.status === 200) {
        return axios(err.config);
      }
    }

    refresh = false;
    return err;
  }
);
