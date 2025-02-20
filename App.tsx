// src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import SplashScreen from "./src/screens/SplashScreen.tsx";
import LoginScreen from "./src/screens/LoginScreen.tsx";
import RegisterScreen from "./src/screens/RegisterScreen.tsx";
import ProductScreen from './src/screens/ProductScreen.tsx';
import AddProduct from './src/screens/AddProduct.tsx';
import EditProduct from './src/screens/EditProduct.tsx';
import Statistical from './src/screens/Statistical.tsx';

const Stack = createStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator
            initialRouteName="EditProduct"
            screenOptions={{ headerShown: false }}  // Ẩn header kiểu xưa
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Product" component={ProductScreen} />
          <Stack.Screen name='AddProduct' component={AddProduct} />
          <Stack.Screen name='EditProduct' component={EditProduct} />
          <Stack.Screen name='Statistical' component={Statistical} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;