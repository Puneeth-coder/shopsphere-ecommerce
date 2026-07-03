import axios from "axios";

let baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
if (baseUrl && !baseUrl.endsWith("/api")) {
  baseUrl = `${baseUrl}/api`;
}

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export default api;