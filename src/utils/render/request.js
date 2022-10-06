import axios from "axios";

export const request = axios.create({
  timeout:5000,
})
