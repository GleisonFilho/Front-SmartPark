import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Importação do Contexto e Estilos
import { useAuth } from './context/AuthContext';
import { colors } from './styles/theme';

// Importação das Telas
import Dashboard from './screens/Dashboard';
import Vagas from './screens/Vagas';
import Veiculos from './screens/Veiculos';
import Checkin from './screens/Checkin';
import Checkout from './screens/Checkout';
import Login from './screens/login';
import Cadastro from './screens/Cadastro';
import Mapa from './screens/Mapa';
import Scanner from './screens/Scanner'; 
import AdminDashboard from './screens/AdminDashboard';
import AdminCadastroEstacionamento from './screens/AdminCadastroEstacionamento';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// --- NAVEGAÇÃO POR PERFIL (TABS) ---

function TabNavigator() {
  const { user } = useAuth();
  // Normalização do Role para evitar erros de case-sensitive (ex: 'user' vs 'USER')
  const role = user?.role?.toUpperCase(); 

  console.log("DEBUG - Renderizando Tabs para Role:", role);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.card,
          height: 60,
          paddingBottom: 8,
          borderTopWidth: 0,
          elevation: 10
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          
          if (route.name === 'Início' || route.name === 'Admin') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Mapa') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'Vagas') iconName = focused ? 'pin' : 'pin-outline';
          else if (route.name === 'Veículos') iconName = focused ? 'car' : 'car-outline';
          else if (route.name === 'Sair') iconName = focused ? 'log-out' : 'log-out-outline';

          return <Ionicons name={iconName} size={22} color={color} />;
        }
      })}
    >
      {/* ABAS ADM */}
      {role === 'ADM' && (
        <Tab.Screen name="Admin" component={AdminDashboard} />
      )}

      {/* ABAS OPERADOR */}
      {role === 'OPERADOR' && (
        <>
          <Tab.Screen name="Início" component={Dashboard} />
          <Tab.Screen name="Vagas" component={Vagas} />
          <Tab.Screen name="Sair" component={Checkout} />
        </>
      )}

      {/* ABAS USUÁRIO COMUM */}
      {role === 'USER' && (
        <>
          <Tab.Screen name="Início" component={Dashboard} />
          <Tab.Screen name="Mapa" component={Mapa} />
          <Tab.Screen name="Veículos" component={Veiculos} />
          <Tab.Screen name="Sair" component={Checkout} />
        </>
      )}
    </Tab.Navigator>
  );
}

// --- NAVEGADOR PRINCIPAL (STACK) ---

export default function Routes() {
  const { signed, loading, user } = useAuth();
  const role = user?.role?.toUpperCase(); 

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName={!signed ? "Login" : "Main"} 
      >
        {!signed ? (
          <>
            <Stack.Screen name='Login' component={Login}/>
            <Stack.Screen name='Cadastro' component={Cadastro}/>
          </>
        ) : (
          <>
            {/* O TabNavigator controla as abas inferiores de quem está autenticado */}
            <Stack.Screen name="Main" component={TabNavigator} />
            
            {/* Fluxos internos de Stack do OPERADOR */}
            {role === 'OPERADOR' && (
              <>
                <Stack.Screen name="Checkin" component={Checkin} />
                <Stack.Screen name="Scanner" component={Scanner} />
              </>
            )}
            
            {/* Fluxos internos de Stack do ADM */}
            {role === 'ADM' && (
              <Stack.Screen 
                name="AdminCadastroEstacionamento" 
                component={AdminCadastroEstacionamento} 
              />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}