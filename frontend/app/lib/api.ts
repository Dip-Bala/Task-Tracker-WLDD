import axios from "axios";

if(!process.env.NEXT_PUBLIC_BACKEND_URL){
  throw Error("Backend url is not loaded from env")
}
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});
