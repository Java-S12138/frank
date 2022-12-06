import axios from "axios";

export const request = axios.create({
  timeout:5000
})
export const blacklistServe = axios.create({
  baseURL:import.meta.env.VITE_BASE_API,
  timeout:5000
})
