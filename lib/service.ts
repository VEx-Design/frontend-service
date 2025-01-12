import axios from "axios";

if (!process.env.NEXT_PUBLIC_API_GATEWAY) {
  console.error("API_GATEWAY environment variable is not set.");
}

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY || "http://localhost:8080",
});
