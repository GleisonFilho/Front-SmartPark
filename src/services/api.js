import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "https://estacionamento-rotativo-l65y.onrender.com";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// Interceptor para injetar automaticamente o token JWT em cada requisição
api.interceptors.request.use(async (config) => {
  try {
    const userStorage = await AsyncStorage.getItem('@SmartPark:user');
    if (userStorage) {
      const { token } = JSON.parse(userStorage);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.log("Erro ao recuperar token do AsyncStorage", error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const normalizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true";
};

export default api;