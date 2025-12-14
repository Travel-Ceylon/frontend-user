import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;
console.log("API Base URL:", url);
export const api = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
