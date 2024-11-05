// src/routes/Rutas.jsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Home from '../screens/Home';

const Stack = createStackNavigator();

export default function Rutas() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    );
}
