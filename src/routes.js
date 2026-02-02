import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from './styles/theme';
import { Ionicons } from '@expo/vector-icons';

import Dashboard from './screens/Dashboard';
import Vagas from './screens/Vagas';
import Veiculos from './screens/Veiculos';
import Checkin from './screens/Checkin';
import Checkout from './screens/Checkout';
import Login from './screens/login';
import Cadastro from './screens/Cadastro';
import Mapa from './screens/Mapa';
import AdminDashboard from './screens/AdminDashboard';
import AdminCadastroEstacionamento from './screens/AdminCadastroEstacionamento';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator({ route }) {
  const { role } = route.params || { role: 'USER' };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 0,
          elevation: 10
        },

        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Home' || route.name === 'Admin') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Mapa') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Vagas') {
            iconName = focused ? 'pin' : 'pin-outline';
          } else if (route.name === 'Veículos') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'Checkout') {
            iconName = focused ? 'log-out' : 'log-out-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        }
      })}
    >
      {role === 'ADMIN' ? (
        <Tab.Screen name="Admin" component={AdminDashboard} />
      ) : (
        <Tab.Screen name="Home" component={Dashboard} />
      )}
      <Tab.Screen name="Mapa" component={Mapa} />
      <Tab.Screen name="Vagas" component={Vagas} />
      <Tab.Screen name="Veículos" component={Veiculos} />
      <Tab.Screen name="Checkout" component={Checkout} />
    </Tab.Navigator>
  );
}

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Login'>
        <Stack.Screen name='Login' component={Login}/>
        <Stack.Screen name='Cadastro' component={Cadastro}/>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Checkin" component={Checkin} />
        <Stack.Screen name="AdminCadastroEstacionamento" component={AdminCadastroEstacionamento} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
