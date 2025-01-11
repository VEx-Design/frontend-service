import axios from "axios";

if (!process.env.NEXT_API_GATEWAY) {
  console.error("API_GATEWAY environment variable is not set.");
}

export const service = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY || "http://10.126.96.137:8080",
});
