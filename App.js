// src/App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen'; // New screen for Converter
import ChatScreen from './src/screens/ChatScreen'; // New screen for Chatbot
import dataset from './src/constants/ingredients.json';

export const GEMINI_API_KEY = 'AIzaSyCobW0aUWzTnhSjQ8qH13TqtDbGMqh_DhI';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Smart Recipe Converter' }}
          initialParams={{ dataset }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ title: 'Baking Assistant' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}