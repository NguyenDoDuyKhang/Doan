import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/Login';
import AdminListScreen from './screens/AdminListService';
import CustomerListScreen from './screens/CustomerListService';
import DetailScreen from './screens/DetailScreen';  // Import DetailScreen

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AdminListService" component={AdminListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CustomerListService" component={CustomerListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DetailScreen" component={DetailScreen} options={{ title: 'Service Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;