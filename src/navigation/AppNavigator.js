import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/colors';

import SeleccionRol       from '../screens/auth/SeleccionRol';
import LoginAdulto        from '../screens/auth/LoginAdulto';
import LoginCuidador      from '../screens/auth/LoginCuidador';
import HomeAdulto         from '../screens/usuario/HomeAdulto';
import Medicamentos       from '../screens/usuario/Medicamentos';
import RegistrarSalud     from '../screens/usuario/RegistrarSalud';
import Emergencia         from '../screens/usuario/Emergencia';
import Perfil             from '../screens/usuario/Perfil';
import HomeCuidador       from '../screens/cuidador/HomeCuidador';
import DetallePaciente    from '../screens/cuidador/DetallePaciente';
import RegistrarPaciente  from '../screens/cuidador/RegistrarPaciente';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const ICONOS = { Inicio:'🏠', Medicamentos:'💊', Salud:'❤️', Perfil:'👤', Pacientes:'👥', Alertas:'🔔' };

function TabsAdulto() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.verde,
      tabBarInactiveTintColor: COLORS.gris,
      tabBarStyle: { paddingBottom: 6, height: 60 },
      tabBarIcon: ({ focused }) => (
        <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>{ICONOS[route.name]}</Text>
      ),
    })}>
      <Tab.Screen name="Inicio"       component={HomeAdulto} />
      <Tab.Screen name="Medicamentos" component={Medicamentos} />
      <Tab.Screen name="Salud"        component={RegistrarSalud} />
      <Tab.Screen name="Perfil"       component={Perfil} />
    </Tab.Navigator>
  );
}

function TabsCuidador() {
  const { alertasCambio } = useAuth();
  const pendientes = alertasCambio.filter(a => !a.leida).length;
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.azul,
      tabBarInactiveTintColor: COLORS.gris,
      tabBarStyle: { paddingBottom: 6, height: 60 },
      tabBarIcon: ({ focused }) => (
        <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>{ICONOS[route.name]}</Text>
      ),
    })}>
      <Tab.Screen name="Pacientes" component={HomeCuidador} />
      <Tab.Screen
        name="Alertas"
        component={HomeCuidador}
        options={{ tabBarBadge: pendientes > 0 ? pendientes : undefined }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { usuario } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!usuario ? (
          <>
            <Stack.Screen name="SeleccionRol"  component={SeleccionRol} />
            <Stack.Screen name="LoginAdulto"   component={LoginAdulto} />
            <Stack.Screen name="LoginCuidador" component={LoginCuidador} />
          </>
        ) : usuario.rol === 'adulto' ? (
          <>
            <Stack.Screen name="TabsAdulto" component={TabsAdulto} />
            <Stack.Screen name="Emergencia" component={Emergencia} />
          </>
        ) : (
          <>
            <Stack.Screen name="TabsCuidador"     component={TabsCuidador} />
            <Stack.Screen name="DetallePaciente"  component={DetallePaciente} />
            <Stack.Screen name="RegistrarPaciente" component={RegistrarPaciente} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
