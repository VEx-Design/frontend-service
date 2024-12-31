import axios from "axios";

// if (!process.env.NEXT_API_GATEWAY) {
//   console.error("API_GATEWAY environment variable is not set.");
// }

export const service = axios.create({
  baseURL: process.env.NEXT_API_GATEWAY || "http://localhost:8080",
});
