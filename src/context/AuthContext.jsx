import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    async function resetAndLoadData() {
      // COMENTE as linhas abaixo após conseguir deslogar uma vez:
      // await AsyncStorage.removeItem('@SmartPark:user'); 
      // setUser(null);
      
      const storageUser = await AsyncStorage.getItem('@SmartPark:user');
      if (storageUser) {
        setUser(JSON.parse(storageUser));
      }
      setLoading(false);
    }
    resetAndLoadData();
  }, []);

  async function signIn(email, senha) {
    setLoading(true);
    try {
      // Chamada para o seu backend atual
      const response = await api.post('/auth/login', { email, senha });
      
      const { user: userData, token } = response.data;

      // --- INJEÇÃO DE PERFIL PARA TESTE ---
      // Forçamos o 'role' como OPERADOR para liberar as telas no routes.js
      // Você pode alterar para 'ADM' ou 'USER' aqui para testar as outras visões.
      const userComPerfilForçado = { 
        ...userData, 
        role: 'OPERADOR' 
      };

      const data = { ...userComPerfilForçado, token };
      
      // Salva o usuário com o perfil injetado no estado e no celular
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
    // Limpa o armazenamento e reseta o estado para voltar ao Login
    AsyncStorage.clear().then(() => setUser(null));
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);