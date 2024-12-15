import axios from "axios";

export const service = axios.create({
  baseURL: process.env.API_GATEWAY,
});
