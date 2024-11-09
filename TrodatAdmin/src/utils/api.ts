import axios from "axios";
import { isDev } from './constants';

export const api = axios.create({
  baseURL: isDev ? 'http://localhost:8080/api' : 'http://localhost:8080/api',
  responseType: 'json'
});

