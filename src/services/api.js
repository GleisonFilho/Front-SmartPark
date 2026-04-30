import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "https://estacionamento-rotativo-l65y.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

api.interceptors.request.use(async (config) => {
  const userStorage = await AsyncStorage.getItem('@SmartPark:user');
  if (userStorage) {
    const { token } = JSON.parse(userStorage);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const normalizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true";
};

export default api;