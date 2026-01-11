import axios from "axios";

// ⚠️ IMPORTANTE: Substitua pelo IP da máquina onde o backend está rodando
// Se estiver usando emulador Android: 10.0.2.2
// Se estiver usando celular físico: O IP da sua rede local (ex: 192.168.1.14)
const BASE_URL = "http://192.168.1.13:8080"; 

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

export const normalizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true";
};

export default api;
