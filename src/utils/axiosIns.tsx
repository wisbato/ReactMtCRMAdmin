import axios from "axios";
 
 
const baseURL = import.meta.env.VITE_API_URL;
 
 
const axiosIns = axios.create({
  baseURL: baseURL,
  withCredentials:true, 
  headers: {
    "Content-Type": "application/json",
  },
});
 
export default axiosIns;