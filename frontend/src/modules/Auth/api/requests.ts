import axios from 'axios';
import { AUTH } from '../../../../../shared/constants/endpoints';

const { VITE_API_URL } = import.meta.env;

async function loginRequest(data: any) {
  const res = await axios.post<{ accessToken: string }>(
    VITE_API_URL + AUTH.login,
    data,
    { withCredentials: true }
  );
  return res.data;
}

async function logoutRequest() {
  await axios.post(
    VITE_API_URL + AUTH.logout,
    undefined,
    { withCredentials: true }
  );
}

async function refreshRequest() {
  const res = await axios.post<{ accessToken: string }>(
    VITE_API_URL + AUTH.refresh,
    undefined,
    { withCredentials: true }
  );
  return res.data;
}

export { 
  loginRequest,
  logoutRequest,
  refreshRequest,
};
 