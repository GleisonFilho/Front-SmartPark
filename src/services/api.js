import axios from "axios";

const BASE_URL = "https://estacionamento-rotativo-l65y.onrender.com"; 

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

export const normalizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true";
};

export default api;
