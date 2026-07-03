import axios from "axios";

let baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Failsafe: automatically append /api if it's missing in Vercel settings
if (baseUrl && !baseUrl.endsWith("/api")) {
  baseUrl = `${baseUrl}/api`;
}

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export default api;