import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem('@SmartPark:user');
      if (storageUser) {
        setUser(JSON.parse(storageUser));
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function signIn(email, senha) {
    setLoading(true);
    try {
      // Faz a chamada para o seu controlador Spring Boot
      const response = await api.post('/auth/login', { email, senha });
      
      // Como o seu AuthController retorna o DTO diretamente, pegamos o response.data
      const userData = response.data;

      // Montamos o objeto de usuário com o 'role' que vem do banco de dados
      const data = {
        id: userData.id,
        email: userData.email,
        nome: userData.nome || userData.email, 
        role: userData.role, // Aqui ele captura 'OPERADOR', 'ADM' ou 'USER' do BD
        token: userData.token || "" // Garante compatibilidade com o interceptor da API
      };
      
      setUser(data);
      await AsyncStorage.setItem('@SmartPark:user', JSON.stringify(data));
      
    } catch (error) {
      console.error("Erro no login:", error);
      const msg = error.response?.data?.message || "Verifique suas credenciais.";
      alert("Falha no login: " + msg);
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    // Limpa o cache para que o routes.js redirecione para a tela de Login
    AsyncStorage.clear().then(() => setUser(null));
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);