import axios from "axios";

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

process.env.NEXT_PUBLIC_BACKEND_URL