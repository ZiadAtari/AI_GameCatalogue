import React from 'react';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { Stack } from 'expo-router';

const RootLayout = () => {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="questionnaire" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="gameScreen" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
};

export default RootLayout;
