import axios from "axios";
<<<<<<< HEAD
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "https://estacionamento-rotativo-l65y.onrender.com";

const api = axios.create({
=======

const BASE_URL = "https://estacionamento-rotativo-l65y.onrender.com"; 

export const api = axios.create({
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
  baseURL: BASE_URL,
  timeout: 5000,
});

<<<<<<< HEAD
api.interceptors.request.use(async (config) => {
  const userStorage = await AsyncStorage.getItem('@SmartPark:user');
  if (userStorage) {
    const { token } = JSON.parse(userStorage);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

=======
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
export const normalizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true";
};

<<<<<<< HEAD
export default api;
=======
export default api;
>>>>>>> 0726f64c57c1433dbfe11c155c9ab4433a111e40
