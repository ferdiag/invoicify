import axios from 'axios';
import { API_PREFIX } from '../../../shared/paths';
const url = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const api = axios.create({
  baseURL: `${url}${API_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
  },
});
export { api };
