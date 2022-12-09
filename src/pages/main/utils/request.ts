import axios from "axios";

export const request = axios.create({
  timeout:9999
})
export const blacklistServe = axios.create({
  baseURL:import.meta.env.VITE_BASE_API,
  timeout:9999
})
